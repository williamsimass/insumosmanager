const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-insumos.onrender.com';

const dataManager = {
  async fetchInsumos() {
    try {
      const response = await fetch(`${API_BASE_URL}/insumos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar insumos:", error);
      return [];
    }
  },

  async addInsumo(insumo) {
    try {
      const response = await fetch(`${API_BASE_URL}/insumos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insumo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao adicionar insumo:", error);
      throw error;
    }
  },

  async updateInsumo(insumo) {
    try {
      const response = await fetch(`${API_BASE_URL}/insumos/${insumo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insumo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar insumo:", error);
      throw error;
    }
  },

    async importInsumos(insumos) {
    try {
      const response = await fetch(`${API_BASE_URL}/insumos/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insumos),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao importar insumos em massa:", error);
      throw error;
    }
  },


  async deleteInsumo(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/insumos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao deletar insumo:", error);
      throw error;
    }
  },

  // ==================== FORNECEDORES ====================

  async fetchFornecedores() {
    try {
      const response = await fetch(`${API_BASE_URL}/fornecedores`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      return [];
    }
  },

  async addFornecedor(fornecedor) {
    try {
      const response = await fetch(`${API_BASE_URL}/fornecedores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fornecedor),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error);
      throw error;
    }
  },

  async updateFornecedor(fornecedor) {
    try {
      const response = await fetch(`${API_BASE_URL}/fornecedores/${fornecedor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fornecedor),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw error;
    }
  },

  async deleteFornecedor(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      throw error;
    }
  },

  async clearAllData() {
    try {
      const response = await fetch(`${API_BASE_URL}/insumos/clear-all`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao limpar todos os dados:", error);
      throw error;
    }
  },

  // As funções de import/export JSON ainda podem ser úteis para backup local
  // ou migração de dados do localStorage para o backend.
  exportData: () => {
    console.warn("A função exportData agora depende da lógica de dados do backend.");
  },

  importData: (data) => {
    console.warn("A função importData agora depende da lógica de dados do backend.");
  },
};

export default dataManager;


