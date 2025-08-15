import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import InsumoForm from './components/InsumoForm';
import InsumosList from './components/InsumosList';
import Dashboard from './components/Dashboard';
import FornecedorForm from './components/FornecedorForm';
import FornecedoresList from './components/FornecedoresList';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import dataManager from './lib/dataManager'; // Importação correta do dataManager
import './App.css'; // <--- ESTA LINHA É CRUCIAL PARA O CSS

function App() {
  const [activeTab, setActiveTab] = useState("add");
  const [insumos, setInsumos] = useState([]);
  const [solicitantes, setSolicitantes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  // Função para carregar insumos do backend
  const loadInsumos = useCallback(async () => {
    const fetchedInsumos = await dataManager.fetchInsumos();
    setInsumos(fetchedInsumos);

    // Atualiza a lista de solicitantes únicos
    const uniqueSolicitantes = [...new Set(fetchedInsumos.map(i => i.solicitante).filter(Boolean))];
    setSolicitantes(uniqueSolicitantes);
  }, []);

  // Função para carregar fornecedores do backend
  const loadFornecedores = useCallback(async () => {
    const fetchedFornecedores = await dataManager.fetchFornecedores();
    setFornecedores(fetchedFornecedores);
  }, []);

  useEffect(() => {
    loadInsumos();
    loadFornecedores();
  }, [loadInsumos, loadFornecedores]);

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

  // ==================== FUNÇÕES FORNECEDORES ====================

  const handleAddFornecedor = async (newFornecedor) => {
    await dataManager.addFornecedor(newFornecedor);
    loadFornecedores(); // Recarrega os fornecedores após adicionar
  };

  const handleUpdateFornecedor = async (updatedFornecedor) => {
    await dataManager.updateFornecedor(updatedFornecedor);
    loadFornecedores(); // Recarrega os fornecedores após atualizar
  };

  const handleDeleteFornecedor = async (id) => {
    await dataManager.deleteFornecedor(id);
    loadFornecedores(); // Recarrega os fornecedores após deletar
  };

  // Funções de exportar/importar (agora enviam para o backend)
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

  // Nova função para exportar para Excel
  const handleExportExcel = () => {
    if (insumos.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    // Preparar dados para exportação
    const dadosParaExportar = insumos.map(insumo => ({
      'Data Solicitação': insumo.dataSolicitacao ? new Date(insumo.dataSolicitacao).toLocaleDateString('pt-BR') : '',
      'Data Aprovação': insumo.dataAprovacao ? new Date(insumo.dataAprovacao).toLocaleDateString('pt-BR') : '',
      'Aprovado Por': insumo.aprovadoPor || '',
      'Solicitante': insumo.solicitante || '',
      'Centro de Custo': insumo.centroCusto || '',
      'Equipamento': insumo.equipamento || '',
      'Status': insumo.status || '',
      'Número do Chamado': insumo.numeroChamado || '',
      'Equipamento e Quantidade': insumo.equipamentoQuantidade || '',
      'Valor (R$)': insumo.valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insumo.valor) : 'R$ 0,00'
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dadosParaExportar);

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 15 }, // Data Solicitação
      { wch: 15 }, // Data Aprovação
      { wch: 20 }, // Aprovado Por
      { wch: 25 }, // Solicitante
      { wch: 18 }, // Centro de Custo
      { wch: 30 }, // Equipamento
      { wch: 20 }, // Status
      { wch: 18 }, // Número do Chamado
      { wch: 35 }, // Equipamento e Quantidade
      { wch: 15 }  // Valor
    ];
    ws['!cols'] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Insumos');

    // Gerar nome do arquivo com data atual
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `insumos_${dataAtual}.xlsx`;

    // Fazer download
    XLSX.writeFile(wb, nomeArquivo);
  };

    const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.insumos && Array.isArray(importedData.insumos)) {
            try {
              // AGORA CHAMA A NOVA FUNÇÃO NO dataManager
              const result = await dataManager.importInsumos(importedData.insumos);
              alert(result.message);
              loadInsumos(); // Recarrega para refletir os novos dados
            } catch (apiError) {
              console.error("Erro ao enviar dados para a API de importação:", apiError);
              alert("Erro ao importar dados para o backend. Verifique o console para detalhes.");
            }
          }
        } catch (error) {
          console.error("Erro ao importar arquivo JSON:", error);
          alert("Erro ao importar arquivo. Verifique se é um JSON válido.");
        }
      };
      reader.readAsText(file);
    }
  };


  const handleClearAllData = async () => {
    if (window.confirm('Tem certeza que deseja excluir TODOS os dados? Esta ação não pode ser desfeita.')) {
      try {
        const result = await dataManager.clearAllData();
        alert(result.message);
        loadInsumos(); // Recarrega os insumos após limpar
        loadFornecedores(); // Recarrega os fornecedores após limpar
      } catch (error) {
        console.error("Erro ao limpar dados:", error);
        alert("Erro ao limpar dados. Verifique o console para detalhes.");
      }
    }
  };
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
            Exportar Dados (JSON)
          </Button>
          <Button onClick={handleExportExcel} variant="outline">
            Exportar para Excel
          </Button>
          <label htmlFor="import-file" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
            Importar Dados
            <input id="import-file" type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
          <Button onClick={handleClearAllData} variant="destructive">
            Limpar Todos os Dados
          </Button>
          {/* Botão de Limpar Todos os Dados (Local) - Removido ou Comentado */}
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
        <Button
          variant={activeTab === "fornecedores" ? "default" : "outline"}
          onClick={() => setActiveTab("fornecedores")}
        >
          Fornecedores e Links
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
        {activeTab === "fornecedores" && (
          <div className="space-y-8">
            <FornecedorForm onAddFornecedor={handleAddFornecedor} />
            <FornecedoresList
              fornecedores={fornecedores}
              onUpdateFornecedor={handleUpdateFornecedor}
              onDeleteFornecedor={handleDeleteFornecedor}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
