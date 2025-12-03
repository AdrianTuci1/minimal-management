defmodule DisplaySim.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      # DisplaySim.Repo,

      # Start the WebSocket supervisor
      {DisplaySim.WebSocketSupervisor, []},

      # Start the HTTP server
      {Plug.Cowboy, scheme: :http, plug: DisplaySim.Router, options: [port: cowboy_port()]}
    ]

    opts = [strategy: :one_for_one, name: DisplaySim.Supervisor]
    Supervisor.start_link(children, opts)
  end

  defp cowboy_port do
    Application.get_env(:display_sim, :cowboy_port, 4000)
  end
end
