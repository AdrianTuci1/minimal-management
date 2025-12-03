defmodule DisplaySim.WebSocketHandler do
  @moduledoc """
  Handler pentru conexiunile WebSocket.
  """

  @behaviour Plug Cowboy WebSocket Handler

  def init(req, state) do
    # Pregătim pentru upgrade la WebSocket
    {:cowboy_websocket, req, state}
  end

  def websocket_init(_transport, req, state) do
    # Creăm o nouă conexiune și o adăugăm la supervizor
    {:ok, connection} = DisplaySim.WebSocketSupervisor.add_connection(self())

    # Starea inițială a conexiunii
    {:ok, %{connection: connection, authenticated: false}}
  end

  def websocket_handle({:text, message}, state) do
    case Jason.decode(message) do
      {:ok, data} ->
        handle_message(data, state)
      {:error, _} ->
        # Trimitem eroare dacă mesajul nu este JSON valid
        reply_error("Invalid JSON format")
        state
    end
  end

  def websocket_handle(_data, state) do
    # Ignorăm mesajele de alt tip
    state
  end

  def websocket_info({:send, message}, state) do
    # Trimitem mesaj către client
    {:reply, {:text, Jason.encode!(message)}, state}
  end

  def websocket_info(:close, state) do
    # Închidem conexiunea
    {:close, state}
  end

  def websocket_info(_info, state) do
    # Ignorăm alte mesaje
    state
  end

  def terminate(_reason, _req, state) do
    # Curățăm resursele la terminare
    if state.connection do
      DisplaySim.WebSocketSupervisor.remove_connection(state.connection)
    end
    :ok
  end

  # Funcție pentru a gestiona mesajele primite de la client
  defp handle_message(%{"type" => "auth", "workspace_id" => workspace_id, "user_id" => user_id}, state) do
    # Autentificăm utilizatorul
    GenServer.cast(state.connection, {:authenticate, workspace_id, user_id})

    # Trimitem confirmare
    {:reply, {:text, Jason.encode!(%{type: "auth_success"})}, %{state | authenticated: true}}
  end

  defp handle_message(%{"type" => "ping"}, state) do
    # Răspundem la ping
    {:reply, {:text, Jason.encode!(%{type: "pong"})}, state}
  end

  defp handle_message(_message, state) do
    # Pentru mesaje necunoscute, trimitem eroare
    reply_error("Unknown message type")
    state
  end

  # Funcție pentru a trimite un mesaj de eroare
  defp reply_error(message) do
    {:reply, {:text, Jason.encode!(%{type: "error", message: message})}}
  end
end
