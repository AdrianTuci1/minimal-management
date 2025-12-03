defmodule DisplaySim.WebSocketSupervisor do
  @moduledoc """
  Supervisor pentru gestionarea conexiunilor WebSocket în timp real.
  """

  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    children = [
      {Registry, keys: :unique, name: DisplaySim.WebSocketRegistry},
      {DynamicSupervisor, strategy: :one_for_one, name: DisplaySim.ConnectionSupervisor}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end

  @doc """
  Adaugă o nouă conexiune WebSocket la supervizor.
  """
  def add_connection(socket) do
    DynamicSupervisor.start_child(
      DisplaySim.ConnectionSupervisor,
      {DisplaySim.Connection, socket}
    )
  end

  @doc """
  Elimină o conexiune WebSocket din supervizor.
  """
  def remove_connection(socket) do
    case Registry.lookup(DisplaySim.WebSocketRegistry, socket) do
      [{pid, _}] ->
        DynamicSupervisor.terminate_child(DisplaySim.ConnectionSupervisor, pid)
      [] ->
        :ok
    end
  end

  @doc """
  Obține toate conexiunile active pentru un workspace.
  """
  def get_workspace_connections(workspace_id) do
    DisplaySim.WebSocketRegistry
    |> Registry.select([{{:workspace_id, ^workspace_id}, _, _}])
    |> Enum.map(fn {pid, _} -> pid end)
  end

  @doc """
  Trimite un mesaj către toate conexiunile dintr-un workspace.
  """
  def broadcast_to_workspace(workspace_id, message) do
    workspace_id
    |> get_workspace_connections()
    |> Enum.each(fn pid ->
      send(pid, {:broadcast, message})
    end)
  end

  @doc """
  Trimite un mesaj către un utilizator specific.
  """
  def send_to_user(user_id, message) do
    case Registry.lookup(DisplaySim.WebSocketRegistry, user_id) do
      [{pid, _}] ->
        send(pid, {:send, message})
      [] ->
        :ok
    end
  end
end
