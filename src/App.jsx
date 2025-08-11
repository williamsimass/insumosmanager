import { useState, useEffect, useCallback } from 'react';
import InsumoForm from './components/InsumoForm';
import InsumosList from './components/InsumosList';
import Dashboard from './components/Dashboard';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import dataManager from './lib/dataManager'; // Importação correta do dataManager
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState("add");
  const [insumos, setInsumos] = useState([]);
  const [solicitantes, setSolicitantes] = useState([]);

  // Função para carregar insumos do backend
  const loadInsumos = useCallback(async () => {
    const fetchedInsumos = await dataManager.fetchInsumos();
    setInsumos(fetchedInsumos);

    // Atualiza a lista de solicitantes únicos
    const uniqueSolicitantes = [...new Set(fetchedInsumos.map(i => i.solicitante).filter(Boolean))];
    setSolicitantes(uniqueSolicitantes);
  }, []);

  useEffect(() => {
    loadInsumos();
  }, [loadInsumos]);

  const handleAddInsumo = async (newInsumo) => {
    await dataManager.addInsumo(newInsumo);
    loadInsumos(); // Recarrega os insumos após adicionar
  };

  const handleUpdateInsumo = async (updatedInsumo) => {
    await dataManager.updateInsumo(updatedInsumo);
    loadInsumos(); // Recarrega os insumos após atualizar
  };

  const handleDeleteInsumo = async (id) => {
    await dataManager.deleteInsumo(id);
    loadInsumos(); // Recarrega os insumos após deletar
  };

  // Funções de exportar/importar (ainda usam lógica local, mas idealmente seriam via backend)
  const handleExportData = () => {
    const data = { insumos, solicitantes }; // Exporta os dados atualmente no estado
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "insumos_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.insumos && Array.isArray(importedData.insumos)) {
            console.warn("Importação de dados via frontend não envia para o backend diretamente. Implemente uma rota de importação em massa no backend se necessário.");
            // Exemplo de como adicionar um por um (pode ser lento para muitos dados):
            // for (const insumo of importedData.insumos) {
            //   await dataManager.addInsumo(insumo);
            // }
            loadInsumos(); // Recarrega para refletir qualquer mudança
          }
        } catch (error) {
          console.error("Erro ao importar arquivo JSON:", error);
          alert("Erro ao importar arquivo. Verifique se é um JSON válido.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Estatísticas para o Dashboard (calculadas a partir dos insumos carregados)
  const totalInsumos = insumos.length;
  const totalValor = insumos.reduce((sum, insumo) => sum + (insumo.valor || 0), 0);
  const totalSolicitantes = [...new Set(insumos.map(i => i.solicitante).filter(Boolean))].length;
  const ultimaAtualizacao = insumos.length > 0 
    ? new Date(Math.max(...insumos.map(i => new Date(i.dataSolicitacao || 0).getTime()))).toLocaleDateString("pt-BR")
    : "N/A";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Gerenciador de Insumos</h1>
      <p className="text-center text-gray-600 mb-8">Sistema de controle e aprovação de insumos em tempo real</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center p-4">
          <CardTitle className="text-xl">Total de Insumos</CardTitle>
          <CardContent className="text-3xl font-bold mt-2">{totalInsumos}</CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardTitle className="text-xl">Valor Total</CardTitle>
          <CardContent className="text-3xl font-bold mt-2">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalValor)}
          </CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardTitle className="text-xl">Solicitantes</CardTitle>
          <CardContent className="text-3xl font-bold mt-2">{totalSolicitantes}</CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardTitle className="text-xl">Última Atualização</CardTitle>
          <CardContent className="text-xl font-bold mt-2">{ultimaAtualizacao}</CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Gerenciar Dados</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={handleExportData}>
            Exportar Dados
          </Button>
          <label htmlFor="import-file" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
            Importar Dados
            <input id="import-file" type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
          <Button variant="destructive" onClick={() => {
            if (window.confirm("Tem certeza que deseja limpar TODOS os dados? Esta ação é irreversível e não afetará o backend diretamente.")) {
              // dataManager.clearAllData(); // Não é mais necessário limpar o localStorage
              setInsumos([]); // Limpa o estado local
              setSolicitantes([]); // Limpa o estado local
              alert("Dados locais limpos. Para limpar dados do backend, você precisaria de uma função específica na API.");
            }
          }}>
            Limpar Todos os Dados (Local)
          </Button>
        </CardContent>
      </Card>

      <div className="flex space-x-4 mb-8">
        <Button
          variant={activeTab === "add" ? "default" : "outline"}
          onClick={() => setActiveTab("add")}
        >
          Adicionar Insumo
        </Button>
        <Button
          variant={activeTab === "list" ? "default" : "outline"}
          onClick={() => setActiveTab("list")}
        >
          Lista de Insumos
        </Button>
        <Button
          variant={activeTab === "dashboard" ? "default" : "outline"}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </Button>
      </div>

      <div>
        {activeTab === "add" && (
          <InsumoForm
            onAddInsumo={handleAddInsumo}
            solicitantes={solicitantes}
          />
        )}
        {activeTab === "list" && (
          <InsumosList
            insumos={insumos}
            onUpdateInsumo={handleUpdateInsumo}
            onDeleteInsumo={handleDeleteInsumo}
          />
        )}
        {activeTab === "dashboard" && (
          <Dashboard insumos={insumos} />
        )}
      </div>
    </div>
  );
}

export default App;
