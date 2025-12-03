import axios from 'axios';

class WorkspaceService {
  constructor() {
    // URL-ul serverului Elixir - va fi preluat din variabilele de mediu
    this.elixirServerUrl = process.env.ELIXIR_SERVER_URL || 'http://localhost:4000';
  }

  // Metodă pentru a notifica serverul Elixir despre schimbări
  async notifyChange(workspaceId, changeData) {
    try {
      const response = await axios.post(
        `${this.elixirServerUrl}/api/workspaces/${workspaceId}/notify`,
        changeData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.ELIXIR_API_KEY || 'default-api-key'
          },
          timeout: 5000 // Timeout de 5 secunde
        }
      );
      
      return response.data;
    } catch (error) {
      // Logăm eroarea dar nu blocăm operațiunea
      console.error('Failed to notify Elixir server:', error.message);
      return null;
    }
  }

  // Metodă pentru a obține utilizatorii conectați la un workspace
  async getConnectedUsers(workspaceId) {
    try {
      const response = await axios.get(
        `${this.elixirServerUrl}/api/workspaces/${workspaceId}/users`,
        {
          headers: {
            'X-API-Key': process.env.ELIXIR_API_KEY || 'default-api-key'
          },
          timeout: 5000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to get connected users:', error.message);
      return [];
    }
  }

  // Metodă pentru a trimite un mesaj către toți utilizatorii dintr-un workspace
  async broadcastMessage(workspaceId, message) {
    try {
      const response = await axios.post(
        `${this.elixirServerUrl}/api/workspaces/${workspaceId}/broadcast`,
        { message },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.ELIXIR_API_KEY || 'default-api-key'
          },
          timeout: 5000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to broadcast message:', error.message);
      return null;
    }
  }

  // Metodă pentru a trimite un mesaj către un utilizator specific
  async sendDirectMessage(userId, message) {
    try {
      const response = await axios.post(
        `${this.elixirServerUrl}/api/users/${userId}/message`,
        { message },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.ELIXIR_API_KEY || 'default-api-key'
          },
          timeout: 5000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to send direct message:', error.message);
      return null;
    }
  }

  // Metodă pentru a verifica starea serverului Elixir
  async checkServerHealth() {
    try {
      const response = await axios.get(
        `${this.elixirServerUrl}/api/health`,
        {
          timeout: 3000
        }
      );
      
      return response.status === 200;
    } catch (error) {
      console.error('Elixir server health check failed:', error.message);
      return false;
    }
  }
}

export default new WorkspaceService();
