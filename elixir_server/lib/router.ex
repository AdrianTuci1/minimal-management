defmodule DisplaySim.Router do
  @moduledoc """
  Router pentru a gestiona atât conexiunile WebSocket cât și request-urile HTTP.
  """

  use Plug.Router
  use Plug.ErrorHandler
  use Plug.Debugger

  if Mix.env() == :dev do
    use Plug.Logger, log: :debug
  else
    use Plug.Logger
  end

  plug Plug.Parsers, parsers: [:json]
  plug :match
  plug :dispatch
  plug CORSPlug, origin: "*"

  get "/health" do
    send_resp(conn, 200, Jason.encode!(%{status: "ok"}))
  end

  # Endpoint pentru notificări de la serverul Node.js
  post "/api/workspaces/:workspace_id/notify" do
    with {:ok, body} <- read_body(conn),
         {:ok, data} <- Jason.decode(body),
         api_key <- get_req_header(conn, "x-api-key"),
         :ok <- verify_api_key(api_key) do

      # Trimitem notificarea către toți clienții conectați la workspace
      workspace_id = String.to_integer(workspace_id)
      DisplaySim.WebSocketSupervisor.broadcast_to_workspace(workspace_id, %{
        type: "data_change",
        entity: data["entity"],
        action: data["type"],
        data: data["data"]
      })

      send_resp(conn, 200, Jason.encode!(%{status: "notified"}))
    else
      _error ->
        send_resp(conn, 401, Jason.encode!(%{error: "Unauthorized"}))
    end
  end

  # Endpoint pentru a trimite mesaje către toți utilizatorii dintr-un workspace
  post "/api/workspaces/:workspace_id/broadcast" do
    with {:ok, body} <- read_body(conn),
         {:ok, data} <- Jason.decode(body),
         api_key <- get_req_header(conn, "x-api-key"),
         :ok <- verify_api_key(api_key) do

      workspace_id = String.to_integer(workspace_id)
      DisplaySim.WebSocketSupervisor.broadcast_to_workspace(workspace_id, %{
        type: "broadcast",
        message: data["message"]
      })

      send_resp(conn, 200, Jason.encode!(%{status: "sent"}))
    else
      _error ->
        send_resp(conn, 401, Jason.encode!(%{error: "Unauthorized"}))
    end
  end

  # Endpoint pentru a trimite mesaje către un utilizator specific
  post "/api/users/:user_id/message" do
    with {:ok, body} <- read_body(conn),
         {:ok, data} <- Jason.decode(body),
         api_key <- get_req_header(conn, "x-api-key"),
         :ok <- verify_api_key(api_key) do

      user_id = String.to_integer(user_id)
      DisplaySim.WebSocketSupervisor.send_to_user(user_id, %{
        type: "direct_message",
        message: data["message"]
      })

      send_resp(conn, 200, Jason.encode!(%{status: "sent"}))
    else
      _error ->
        send_resp(conn, 401, Jason.encode!(%{error: "Unauthorized"}))
    end
  end

  # Endpoint pentru a obține utilizatorii conectați la un workspace
  get "/api/workspaces/:workspace_id/users" do
    with api_key <- get_req_header(conn, "x-api-key"),
         :ok <- verify_api_key(api_key) do

      workspace_id = String.to_integer(workspace_id)
      connections = DisplaySim.WebSocketSupervisor.get_workspace_connections(workspace_id)

      # Obținem ID-urile utilizatorilor din registry
      user_ids = connections
      |> Enum.map(fn pid ->
        case Registry.lookup(DisplaySim.WebSocketRegistry, pid) do
          [{_, {:user, user_id}}] -> user_id
          _ -> nil
        end
      end)
      |> Enum.filter(&(&1))

      send_resp(conn, 200, Jason.encode!(%{users: user_ids}))
    else
      _error ->
        send_resp(conn, 401, Jason.encode!(%{error: "Unauthorized"}))
    end
  end

  # WebSocket endpoint
  get "/ws" do
    conn = Plug.Conn.upgrade_websocket(conn, [], timeout: 60_000)
    {:ok, conn} = DisplaySim.WebSocketHandler.handle_websocket(conn)
    conn
  end

  # Rute pentru match-uri neimplementate
  match _ do
    send_resp(conn, 404, Jason.encode!(%{error: "Not found"}))
  end

  # Verificăm cheia API
  defp verify_api_key(nil), do: {:error, :missing}
  defp verify_api_key(key) do
    expected_key = Application.get_env(:display_sim, :api_key, "default-api-key")
    if key == expected_key do
      :ok
    else
      {:error, :invalid}
    end
  end
end
