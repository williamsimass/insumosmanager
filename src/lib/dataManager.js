// Utilitário para gerenciar dados dos insumos
export const dataManager = {
  // Chaves do localStorage
  KEYS: {
    INSUMOS: 'insumos-manager-data',
    SOLICITANTES: 'insumos-manager-solicitantes',
    SETTINGS: 'insumos-manager-settings'
  },

  // Salvar insumos
  saveInsumos: (insumos) => {
    try {
      localStorage.setItem(dataManager.KEYS.INSUMOS, JSON.stringify(insumos))
      return true
    } catch (error) {
      console.error('Erro ao salvar insumos:', error)
      return false
    }
  },

  // Carregar insumos
  loadInsumos: () => {
    try {
      const data = localStorage.getItem(dataManager.KEYS.INSUMOS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Erro ao carregar insumos:', error)
      return []
    }
  },

  // Salvar lista de solicitantes (para autocomplete)
  saveSolicitantes: (solicitantes) => {
    try {
      localStorage.setItem(dataManager.KEYS.SOLICITANTES, JSON.stringify(solicitantes))
      return true
    } catch (error) {
      console.error('Erro ao salvar solicitantes:', error)
      return false
    }
  },

  // Carregar lista de solicitantes
  loadSolicitantes: () => {
    try {
      const data = localStorage.getItem(dataManager.KEYS.SOLICITANTES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Erro ao carregar solicitantes:', error)
      return []
    }
  },

  // Adicionar novo solicitante à lista (se não existir)
  addSolicitante: (nome) => {
    if (!nome || nome.trim() === '') return

    const solicitantes = dataManager.loadSolicitantes()
    const nomeFormatado = nome.trim()
    
    if (!solicitantes.includes(nomeFormatado)) {
      solicitantes.push(nomeFormatado)
      dataManager.saveSolicitantes(solicitantes)
    }
  },

  // Exportar dados para JSON
  exportData: () => {
    const insumos = dataManager.loadInsumos()
    const solicitantes = dataManager.loadSolicitantes()
    
    const exportData = {
      insumos,
      solicitantes,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    return JSON.stringify(exportData, null, 2)
  },

  // Importar dados de JSON
  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      
      if (data.insumos && Array.isArray(data.insumos)) {
        dataManager.saveInsumos(data.insumos)
      }
      
      if (data.solicitantes && Array.isArray(data.solicitantes)) {
        dataManager.saveSolicitantes(data.solicitantes)
      }
      
      return true
    } catch (error) {
      console.error('Erro ao importar dados:', error)
      return false
    }
  },

  // Limpar todos os dados
  clearAllData: () => {
    try {
      localStorage.removeItem(dataManager.KEYS.INSUMOS)
      localStorage.removeItem(dataManager.KEYS.SOLICITANTES)
      localStorage.removeItem(dataManager.KEYS.SETTINGS)
      return true
    } catch (error) {
      console.error('Erro ao limpar dados:', error)
      return false
    }
  },

  // Obter estatísticas dos dados
  getDataStats: () => {
    const insumos = dataManager.loadInsumos()
    const solicitantes = dataManager.loadSolicitantes()
    
    const totalInsumos = insumos.length
    const totalSolicitantes = solicitantes.length
    const totalValor = insumos.reduce((sum, insumo) => sum + (insumo.valor || 0), 0)
    
    // Estatísticas por status
    const statusStats = insumos.reduce((acc, insumo) => {
      const status = insumo.status || 'Sem status'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    // Estatísticas por centro de custo
    const centroStats = insumos.reduce((acc, insumo) => {
      const centro = insumo.centroCusto || 'Não informado'
      acc[centro] = (acc[centro] || 0) + 1
      return acc
    }, {})

    return {
      totalInsumos,
      totalSolicitantes,
      totalValor,
      statusStats,
      centroStats,
      lastUpdate: insumos.length > 0 ? Math.max(...insumos.map(i => new Date(i.dataCreated || 0).getTime())) : null
    }
  }
}

export default dataManager

