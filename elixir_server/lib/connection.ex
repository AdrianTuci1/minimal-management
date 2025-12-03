defmodule DisplaySim.Connection do
  @moduledoc """
  GenServer pentru gestionarea unei conexiuni WebSocket individuale.
  """

  use GenServer

  def start_link(socket) do
    GenServer.start_link(__MODULE__, socket)
  end

  @impl true
  def init(socket) do
    # Înregistrăm conexiunea în registry cu workspace_id și user_id
    # Aceste informații vor fi trimise de client la conectare
    state = %{
      socket: socket,
      workspace_id: nil,
      user_id: nil,
      authenticated: false
    }

    {:ok, state}
  end

  @impl true
  def handle_call(:get_socket, _from, state) do
    {:reply, state.socket, state}
  end

  @impl true
  def handle_cast({:authenticate, workspace_id, user_id}, state) do
    # Înregistrăm în registry cu workspace_id și user_id
    Registry.register(DisplaySim.WebSocketRegistry, workspace_id, {self(), :workspace})
    Registry.register(DisplaySim.WebSocketRegistry, user_id, {self(), :user})

    new_state = %{state |
      workspace_id: workspace_id,
      user_id: user_id,
      authenticated: true
    }

    {:noreply, new_state}
  end

  @impl true
  def handle_cast({:send, message}, state) do
    if state.authenticated do
      send_message(state.socket, message)
    end
    {:noreply, state}
  end

  @impl true
  def handle_info({:broadcast, message}, state) do
    if state.authenticated do
      send_message(state.socket, message)
    end
    {:noreply, state}
  end

  @impl true
  def handle_info(:close, state) do
    if state.socket && state.authenticated do
      # Dezregistrăm din registry la deconectare
      Registry.unregister(DisplaySim.WebSocketRegistry, state.workspace_id)
      Registry.unregister(DisplaySim.WebSocketRegistry, state.user_id)
    end

    {:stop, :normal, state}
  end

  # Funcție ajutătoare pentru a trimite mesaje prin WebSocket
  defp send_message(socket, message) do
    encoded_message = Jason.encode!(message)
    send(socket, {:text, encoded_message})
  end
end
