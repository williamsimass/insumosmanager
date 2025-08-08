import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Download, Upload, Trash2, BarChart3, Plus, List } from 'lucide-react'
import InsumoForm from './components/InsumoForm.jsx'
import InsumosList from './components/InsumosList.jsx'
import Dashboard from './components/Dashboard.jsx'
import useLocalStorage from './hooks/useLocalStorage.js'
import dataManager from './lib/dataManager.js'
import './App.css'

function App() {
  const [insumos, setInsumos] = useLocalStorage('insumos-manager-data', [])
  const [solicitantes, setSolicitantes] = useLocalStorage('insumos-manager-solicitantes', [])
  const [activeTab, setActiveTab] = useState('form')

  // Adicionar novo insumo
  const handleAddInsumo = (novoInsumo) => {
    setInsumos(prev => [...prev, novoInsumo])
    
    // Adicionar solicitante à lista se não existir
    if (novoInsumo.solicitante && !solicitantes.includes(novoInsumo.solicitante)) {
      setSolicitantes(prev => [...prev, novoInsumo.solicitante])
    }
  }

  // Atualizar insumo existente
  const handleUpdateInsumo = (insumoAtualizado) => {
    setInsumos(prev => 
      prev.map(insumo => 
        insumo.id === insumoAtualizado.id ? insumoAtualizado : insumo
      )
    )
  }

  // Deletar insumo
  const handleDeleteInsumo = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este insumo?')) {
      setInsumos(prev => prev.filter(insumo => insumo.id !== id))
    }
  }

  // Exportar dados
  const handleExportData = () => {
    try {
      const dataToExport = dataManager.exportData()
      const blob = new Blob([dataToExport], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `insumos-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Erro ao exportar dados: ' + error.message)
    }
  }

  // Importar dados
  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const success = dataManager.importData(e.target.result)
        if (success) {
          // Recarregar dados
          setInsumos(dataManager.loadInsumos())
          setSolicitantes(dataManager.loadSolicitantes())
          alert('Dados importados com sucesso!')
        } else {
          alert('Erro ao importar dados. Verifique o formato do arquivo.')
        }
      } catch (error) {
        alert('Erro ao importar dados: ' + error.message)
      }
    }
    reader.readAsText(file)
    event.target.value = '' // Reset input
  }

  // Limpar todos os dados
  const handleClearAllData = () => {
    if (window.confirm('ATENÇÃO: Esta ação irá apagar todos os dados permanentemente. Deseja continuar?')) {
      if (window.confirm('Tem certeza absoluta? Esta ação não pode ser desfeita.')) {
        dataManager.clearAllData()
        setInsumos([])
        setSolicitantes([])
        alert('Todos os dados foram removidos.')
      }
    }
  }

  const stats = dataManager.getDataStats()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Gerenciador de Insumos</h1>
          <p className="text-muted-foreground text-center">
            Sistema de controle e aprovação de insumos em tempo real
          </p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalInsumos}</div>
              <div className="text-sm text-muted-foreground">Total de Insumos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.totalValor)}
              </div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalSolicitantes}</div>
              <div className="text-sm text-muted-foreground">Solicitantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleDateString('pt-BR') : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Última Atualização</div>
            </CardContent>
          </Card>
        </div>

        {/* Ações de Dados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gerenciar Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleExportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
              
              <Button variant="outline" onClick={() => document.getElementById('import-file').click()}>
                <Upload className="h-4 w-4 mr-2" />
                Importar Dados
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              
              <Button variant="destructive" onClick={handleClearAllData}>
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Insumo
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Lista de Insumos
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-6">
            <InsumoForm onAddInsumo={handleAddInsumo} />
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <InsumosList 
              insumos={insumos}
              onUpdateInsumo={handleUpdateInsumo}
              onDeleteInsumo={handleDeleteInsumo}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard insumos={insumos} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
