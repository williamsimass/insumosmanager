import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function NewAutomationPage() {
  const [file, setFile] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAdvogados, setSelectedAdvogados] = useState({});
  const [selectedPrepostos, setSelectedPrepostos] = useState({});
  const [advogadosPorCliente, setAdvogadosPorCliente] = useState({});
  const [analiseClientes, setAnaliseClientes] = useState(null);
  const [planilhaUnificada, setPlanilhaUnificada] = useState(null);

  // Lista de clientes disponíveis
  const clientes = [
    'Itau unibanco',
    'BMG',
    'Pan',
    'Bradesco',
    'clientco',
    'latam',
    'return serasa',
    'too seguros'
  ];

  // Listas de profissionais extraídas do DIVISAO.txt
  const advogadosPautistas = [
    'ALINE PRATES PEREIRA',
    'DANIEL ARAUJO DALTRO',
    'GLEYCE SAMARA DOS SANTOS FERREIRA',
    'GYZELLA PARANHOS DOS SANTOS SOUSA',
    'JANAINA ROCHA DA SILVA AKINTOYESE',
    'JOELMA COSTA LIMA GREGO',
    'MONIQUE FREITAS MENEZES',
    'VIVIAN DA SILVA CASTRO',
    'CAMILA GOMES DA SILVA LIMA',
    'FABRÍCIO ALVES MARIANO',
    'CAROLINE MOTA',
    'JULIE ANNE NOVAIS REGO MARQUES',
    'MILA BASTOS SAMPAIO ORRICO',
    'DÉBORA DE JESUS SANTOS',
    'MAIANE SANTOS CARVALHO'
  ];

  const prepostosPautistas = [
    'ELIVAN DOS SANTOS LIMOEIRO',
    'CARLOS LUÍS SOUZA NEVES',
    'DAYSE DA ROCHA CUMMINGS',
    'LINDIELE SANTOS LOPES',
    'BRENO GOMES DOS SANTOS (B1)',
    'BRENO GOMES SANTOS (B2)',
    'MARIANA KAITLYTN ALVES MATOS',
    'EVA PATRICIA BARBOSA DE CASTRO',
    'AMANDA VITORIA CARDOSO DOS SANTOS',
    'REBECA VITÓRIA MENDES VASCONCELOS',
    'ANDRÉ DOCE SOUZA'
  ];

  const advogadosInternos = [
    'ANA JULYA MUNIZ DA SILVA',
    'CARLOS ALBERTO PERRELLI FERNANDES FILHO',
    'REBECA MAIA HORTA',
    'VICTORIA MENDES ROCHA',
    'JULIANA DE JESUS SILVA',
    'THOMAZ JOSÉ DA SILVA BOMFIM',
    'VANESSA BARREIRA COUTO FERREIRA RIBEIRO',
    'SAADIA IRANI MACARIO BRANDÃO',
    'ADRIELLE SANTOS BRANDÃO',
    'ALICE NABUCO ABREU SOUSA',
    'ALINE KAREN SANTOS RIBEIRO',
    'AMANDA SOUZA MOINHOS',
    'AMANDA TANAJURA FLOR',
    'ANA PAULA SANTOS DE JESUS',
    'ANA VICTORIA MARBACK DOS SANTOS',
    'ANGELA KARINE DA SILVA FIGUEIREDO',
    'ANNA BEATRIZ DUPLAT ABREU',
    'ANTONIO LUCAS DINIZ GONÇALVES BATISTA',
    'CAROLINE PEREIRA CARVALHO',
    'CLEBERSON MACHADO PARENTE',
    'DAIANE SANTANA DE JESUS',
    'DIEGO LOPES AZEVEDO',
    'ELOÁ MASCARENHAS MUNIZ',
    'FABRICIO SOUSA SANTOS AMARAL',
    'GILVAN ALMEIDA DE SOUZA',
    'GUSTAVO BARBOSA DE PAULA',
    'ISABELLA RENARIA TEIXEIRA ROCHA',
    'KAMILLA DE ASSIS SEMBLANO SILVA',
    'LARISSA PAIM PITANGA RIBEIRO LIMA',
    'LEILA DOS SANTOS GOMES',
    'LEONARDO FERREIRA DOS SANTOS',
    'LETÍCIA CASSIMIRO PÊGO',
    'LETICIA DE PINHO GONZAGA',
    'LORENA DE BRITO NASCIMENTO',
    'LUCAS DE MELLO BOTELHO',
    'MANUELA CARLA SOUSA RODRIGUES DE ARGOLLO',
    'NATHALIA DOS SANTOS SOUZA',
    'POLIANA ANDRADE BARBOSA',
    'PRISCILA WANDERLEY SARAIVA',
    'SILVANIA COSTA BARBOSA',
    'STEPHANIE NOVAES OLIVEIRA',
    'TAILANE DA COSTA DOS SANTOS',
    'TAINA OLIVEIRA BRITO',
    'TAISE JOSE DOS SANTOS',
    'THIAGO GOMES SILVA',
    'VICTOR MOURA SENNA',
    'VINICIUS MEIRA FONTES',
    'VICTOR PETTER ANDRÉ DÓREA',
    'BRUNA REIS OLIVEIRA MIRANDA',
    'TIAGO TARGINO CAVALCANTE DE SANTANA',
    'BEATRIZ CONCEIÇÃO DE MATOS',
    'BEATRIZ SANTOS PEIXOTO',
    'LARISSA DALTRO SANTANA',
    'LIVIA ANDRADE OLIVEIRA',
    'MONIQUE FREITAS',
    'BEATRIZ DA SILVA NUNES',
    'BEATRIZ SILVA REIS BATISTA',
    'JARDIEL LUQUINE DA SILVA NETO',
    'JORGE FRANCISCO CARDOZO DE SOUZA',
    'DÉBORA SILVA FREITAS MOLINA ESCOBAR',
    'FLÁVIA DA SILVA BRITO',
    'JEFFERSON LUÍS CHAGAS DOS SANTOS',
    'GABRIELA VIANA MENEZES',
    'LUANA PEDREIRA MASCARENHAS',
    'MICHAELLA COSTA TEIXEIRA',
    'VICTORIA GISELLE DOS REIS DE SOUZA',
    'AMANDA FEDULO FERNANDES',
    'KEY GONÇALVES FERNANDES FILHO',
    'THAIS EMANUELE DA CRUZ DOS SANTOS',
    'ALEXANDRE JATOBÁ GOMES',
    'LARISSA LEITE SANTANA',
    'PALOMA ROCHA ANDRADE'
  ];

  const prepostosIntegrais = [
    'MAYALA ROCHA SAMPAIO ESTRELA',
    'MATHEUS PEREIRA MENDES',
    'RAAB SOUZA DE JESUS',
    'ALEXANDRE AQUINO DOS SANTOS PEREIRA',
    'ARTHUR MATTOS REIS',
    'ISAAC KELVIN MACHADO DA CUNHA',
    'ISLA SANTOS COELHO SILVA',
    'LARISSA LOPEZ DO PRADO BISPO',
    'MARIANA OLIVEIRA DOS REIS',
    'TAISE PINTO DA SILVA',
    'ISABELLA AGUIAR DE ALMEIDA CARNEIRO',
    'MARIA CLARA SOTELINO PASSOS',
    'RODRIGO MARTINS ALMEIDA',
    'SARA PEREIRA DA COSTA',
    'LÉA CALDAS',
    'ERYCKA DOMINIKE NBARBOSA DE SOUSA',
    'JÉSSICA CRISTIANE BORGES DE SOUZA',
    'YAGO GABRIEL ROCHA CARVALHO',
    'ROBERTO RODRIGUES DE LIMA FILHO',
    'LARISE SILVA DOS SANTOS',
    'JANAINA CARIBÉ DE ANDRADE',
    'EDCARLOS DE ARAÚJO BATISTA',
    'LEONARDO JUNQUEIRA AYRES SÁ WIERING',
    'LYARA ROCHA DOS SANTOS E SILVA',
    'LUIZ ANTONIO PEDROZA NUNES NETO',
    'EDUARDO AMBUS DE QUEIROZ',
    'ANA VITÓRIA CARVALHO',
    'DAIANA MACHADO SANTANA',
    'BRENDA NASCIMENTO DA CRUZ BEZERRA SANTOS',
    'RAFAEL SOUZA DANTAS',
    'RAFFAELA PEÇANHA',
    'JESSÉ CARDOSO DE SANTANA',
    'LUIZA BAHIA',
    'RAFAEL CRISOSTOMO DE QUEIROZ',
    'ANA LUÍSA DIAS BASTOS',
    'CAROL PIRES DA CRUZ BRITO',
    'KÉSSIA CONCEIÇÃO DA CRUZ',
    'ADRIELLE NERI DA SILVA SANTOS'
  ];

  const prepostosEstagiarios = [
    'ELIANE DE OLIVEIRA FERREIRA',
    'IGOR RIBEIRO CHAVES RIBEIRO',
    'JOÃO HENRIQUE DE SANTANA',
    'SAMUEL SANTOS CLEMENTINO',
    'IRIS NASCHA FRANÇA BOMFIM',
    'LUCAS GUILHERME SANTOS ALVES',
    'ÉRICA RODRIGUES DOS SANTOS',
    'JAMILE DE CARVALHO BARAÚNA',
    'SERGIO SOARES OLIVEIRA',
    'GEOVANA PINHEIRO SANTANA PAZ DE ALMEIDA',
    'HENRICO DAMASCENO DE CARVALHO',
    'PABLO KAUAN DOS SANTOS VELOSO',
    'MARIA EDUARDA BASTOS BRITO DE SANTANA',
    'IZABELLY CARDOSO LEÃO',
    'MARIA CLARA DA HORA DOS SANTOS',
    'ANA JÚLIA ANJOS DE SOUSA SANTOS',
    'CAROLINA MAYA DE CARVALHO',
    'EDSON DE OLIVEIRA SANTOS',
    'FERNANDA VIEIRA VINHAS',
    'JULIANA KNAPP GAGLIANO DE ALVARENGA',
    'JULIANA MARIA AFFONSO BORGES',
    'LAURA GREICE PAIXÃO',
    'LORENA SAMPAIO GUEDES AZEVEDO',
    'LUZIA ISABEL MOURA SILVA',
    'MARCELLE NICOLLY COELHO DE JESUS',
    'MATEUS FAHEL',
    'SOFIA HELENA AMADO',
    'RAFAELA MELO',
    'VÍTOR BACELLAR SILVEIRA DULTRA',
    'AYLA MIKAELE MATOS DOS SANTOS',
    'BEATRIZ GOUVEIA',
    'BRUNO RAMOS BRUM FILHO',
    'JOÃO GABRIEL DE JESUS DIAS',
    'LARISSA DIAS DE JESUS MIRANDA',
    'LARISSA FERNANDES MESQUITA',
    'LUANDA MILCA OLIVEIRA COSTA SANTOS',
    'MARIA EDUARDA AMORIM FERNANDES',
    'Lícia Souza Mendonça Nascimento',
    'Nina Almeida Vilela Torres',
    'Cecília Alves de Jesus Nascimento',
    'Gabriel Costa Protásio dos Santos',
    'Letícia Oliveira Brunelli Santos',
    'LÍCIA SOUZA MENDONÇA NASCIMENTO',
    'NINA ALMEIDA VILELA TORES',
    'CECÍLIA ALVES DE JESES NASCIMENTO',
    'GABRIEL COSTA PROTÁSIO DOS SANTOS',
    'LETÍCIA OLIVEIRA BRUNELLI SANTOS'
  ];

  // Tipos de audiência para divisão
  const tiposAudiencia = [
    'audiencia virtual -una',
    'audiencia virtual tentativa de conciliação',
    'audiencia virtual de instrução'
  ];

  // Função para ajustar fuso horário para SSA (UTC-3)
  const ajustarFusoHorarioSSA = (hora) => {
    if (!hora) return '';
    
    // Se a hora já está no formato HH:MM, retorna como está (assumindo que já está em SSA)
    if (typeof hora === 'string' && hora.match(/^\d{2}:\d{2}$/)) {
      return hora;
    }
    
    // Se é um objeto Date, converte para SSA
    if (hora instanceof Date) {
      const ssaTime = new Date(hora.getTime() - (3 * 60 * 60 * 1000)); // UTC-3
      return ssaTime.toTimeString().slice(0, 5); // HH:MM
    }
    
    return hora.toString().slice(0, 5);
  };

  // Função para analisar planilha e contar audiências por cliente
  const analisarPlanilha = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Contar audiências por cliente
      const contagemClientes = {};
      
      jsonData.forEach((row) => {
        const clienteRow = row['Cliente'] || row['CLIENTE'] || '';
        const clienteNormalizado = clienteRow.toLowerCase().trim();
        
        if (clienteNormalizado) {
          if (!contagemClientes[clienteNormalizado]) {
            contagemClientes[clienteNormalizado] = 0;
          }
          contagemClientes[clienteNormalizado]++;
        }
      });

      return contagemClientes;
    } catch (error) {
      console.error('Erro ao analisar planilha:', error);
      return {};
    }
  };

  // Função para distribuir audiências entre advogados respeitando intervalo de 1 hora
  const distribuirAudienciasEntreAdvogados = (audiencias, numAdvogados, tipoAudiencia, cliente) => {
    if (numAdvogados <= 1) {
      return audiencias.map(aud => ({
        ...aud,
        'Advogado': selectedAdvogados[`${cliente.toLowerCase()}_${tipoAudiencia.toLowerCase()}`] || `Advogado 1 - ${cliente}`,
      }));
    }

    // Ordenar audiências por data e hora
    const audienciasOrdenadas = [...audiencias].sort((a, b) => {
      const dataA = new Date(`${a['Data_Audiencia']} ${a['Hora']}`);
      const dataB = new Date(`${b['Data_Audiencia']} ${b['Hora']}`);
      return dataA - dataB;
    });

    // Criar estrutura para controlar último horário de cada advogado
    const ultimoHorarioAdvogado = {};
    for (let i = 1; i <= numAdvogados; i++) {
      ultimoHorarioAdvogado[i] = null;
    }

    // Distribuir audiências
    const audienciasDistribuidas = audienciasOrdenadas.map(audiencia => {
      const dataHoraAudiencia = new Date(`${audiencia['Data_Audiencia']} ${audiencia['Hora']}`);
      
      // Encontrar advogado disponível (com pelo menos 1 hora de diferença)
      let advogadoEscolhido = 1;
      for (let i = 1; i <= numAdvogados; i++) {
        const ultimoHorario = ultimoHorarioAdvogado[i];
        if (!ultimoHorario) {
          advogadoEscolhido = i;
          break;
        }
        
        const diferencaHoras = (dataHoraAudiencia - ultimoHorario) / (1000 * 60 * 60);
        if (diferencaHoras >= 1) {
          advogadoEscolhido = i;
          break;
        }
      }
      
      // Atualizar último horário do advogado escolhido
      ultimoHorarioAdvogado[advogadoEscolhido] = dataHoraAudiencia;
      
      return {
        ...audiencia,
        'Advogado': `Advogado ${advogadoEscolhido} - ${cliente}`,
      };
    });

    return audienciasDistribuidas;
  };

  // Função para processar o arquivo Excel
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      
      // Analisar planilha automaticamente
      const analise = await analisarPlanilha(uploadedFile);
      setAnaliseClientes(analise);
      
      // Sugerir quantidade de advogados baseada na análise
      const sugestoes = {};
      Object.keys(analise).forEach(cliente => {
        sugestoes[cliente] = Math.min(analise[cliente], 10); // Máximo 10 advogados por cliente
      });
      setAdvogadosPorCliente(sugestoes);
    }
  };

  // Função para dividir a planilha por tipo de audiência e cliente
  const processarPlanilha = async () => {
    if (!file) {
      alert('Por favor, selecione um arquivo Excel.');
      return;
    }

    setLoading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Dividir por tipo de audiência E cliente
      const divisoes = {};
      const todosRegistros = [];
      
      jsonData.forEach((row, index) => {
        const tipoAud = row['Tipo de Aud'] || row['Tipo_Aud'] || row['TIPO_AUD'] || '';
        const clienteRow = row['Cliente'] || row['CLIENTE'] || '';
        
        const tipoNormalizado = tipoAud.toLowerCase().trim();
        const clienteNormalizado = clienteRow.toLowerCase().trim();

        const chaveDivisao = `${clienteNormalizado}_${tipoNormalizado}`;
        
        if (!divisoes[chaveDivisao]) {
          divisoes[chaveDivisao] = [];
        }
        
        // Adicionar colunas necessárias (sem advogado ainda)
        const novaLinha = {
          ...row,
          'Preposto': selectedPrepostos[chaveDivisao] || '',
          'Observacao': `Cliente: ${clienteRow}`,
          'Hora': ajustarFusoHorarioSSA(row['Hora'] || row['HORA'] || new Date())
        };
        
        divisoes[chaveDivisao].push(novaLinha);
      });

      // Aplicar distribuição de advogados para cada divisão
      Object.keys(divisoes).forEach(chaveDivisao => {
        const [cliente, tipoAudiencia] = chaveDivisao.split('_');
        const numAdvogados = advogadosPorCliente[cliente] || 1;
        
        divisoes[chaveDivisao] = distribuirAudienciasEntreAdvogados(
          divisoes[chaveDivisao], 
          numAdvogados, 
          tipoAudiencia, 
          cliente
        );

        // Adicionar todos os registros à planilha unificada
        todosRegistros.push(...divisoes[chaveDivisao]);
      });

      setProcessedData(divisoes);
      setPlanilhaUnificada(todosRegistros);
    } catch (error) {
      console.error('Erro ao processar planilha:', error);
      alert('Erro ao processar a planilha. Verifique o formato do arquivo e se as colunas \'Tipo de Aud\', \'Cliente\', \'Data_Audiencia\' e \'Hora\' existem.');
    } finally {
      setLoading(false);
    }
  };

  // Função para baixar planilhas divididas
  const baixarPlanilhasDivididas = () => {
    if (!processedData) return;

    Object.keys(processedData).forEach(chaveDivisao => {
      const ws = XLSX.utils.json_to_sheet(processedData[chaveDivisao]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dados');
      
      const nomeArquivo = `pauta_audiencia_${chaveDivisao.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
      XLSX.writeFile(wb, nomeArquivo);
    });
  };

  // Função para baixar planilha unificada
  const baixarPlanilhaUnificada = () => {
    if (!planilhaUnificada) return;

    const ws = XLSX.utils.json_to_sheet(planilhaUnificada);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pauta Unificada');
    
    XLSX.writeFile(wb, 'pauta_audiencia_unificada_completa.xlsx');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Divisora de Planilhas - Pauta de Audiência</h2>
      
      {/* Upload de arquivo */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-3">1. Selecionar Planilha</h3>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Análise da planilha */}
      {analiseClientes && (
        <div className="mb-6 p-4 border rounded-lg bg-green-50">
          <h3 className="text-lg font-semibold mb-3 text-green-800">2. Análise da Planilha</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.keys(analiseClientes).map(cliente => (
              <div key={cliente} className="bg-white p-3 rounded border">
                <div className="font-semibold capitalize">{cliente}</div>
                <div className="text-2xl font-bold text-green-600">{analiseClientes[cliente]}</div>
                <div className="text-sm text-gray-600">audiências</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuração de advogados por cliente */}
      {analiseClientes && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">3. Configurar Advogados por Cliente</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(analiseClientes).map(cliente => (
              <div key={cliente} className="flex flex-col">
                <label className="text-sm font-medium mb-1 capitalize">{cliente}:</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={advogadosPorCliente[cliente] || 1}
                  onChange={(e) => setAdvogadosPorCliente({
                    ...advogadosPorCliente,
                    [cliente]: parseInt(e.target.value) || 1
                  })}
                  className="p-2 border rounded-md text-center"
                />
                <span className="text-xs text-gray-500 mt-1">
                  {advogadosPorCliente[cliente] || 1} advogado(s)
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Configuração Atual:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
              {Object.keys(analiseClientes).map(cliente => (
                <div key={cliente}>
                  <strong className="capitalize">{cliente}:</strong> {advogadosPorCliente[cliente] || 1} advogados
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Seleção de prepostos por tipo de audiência e cliente */}
      {analiseClientes && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">4. Atribuir Prepostos por Cliente e Tipo de Audiência</h3>
          {Object.keys(analiseClientes).map(cliente => (
            <div key={cliente} className="mb-4 border-b pb-4 last:border-b-0">
              <h4 className="font-semibold mb-2 capitalize">Cliente: {cliente} ({advogadosPorCliente[cliente] || 1} advogados configurados)</h4>
              {tiposAudiencia.map(tipo => (
                <div key={`${cliente}-${tipo}`} className="mb-3 ml-4">
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {tipo}:
                  </label>
                  <select
                    value={selectedPrepostos[`${cliente}_${tipo.toLowerCase()}`] || ''}
                    onChange={(e) => setSelectedPrepostos({
                      ...selectedPrepostos,
                      [`${cliente}_${tipo.toLowerCase()}`]: e.target.value
                    })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Selecione um preposto...</option>
                    <optgroup label="Prepostos Pautistas">
                      {prepostosPautistas.map(preposto => (
                        <option key={preposto} value={preposto}>{preposto}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Prepostos Integrais">
                      {prepostosIntegrais.map(preposto => (
                        <option key={preposto} value={preposto}>{preposto}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Prepostos Estagiários">
                      {prepostosEstagiarios.map(preposto => (
                        <option key={preposto} value={preposto}>{preposto}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Botão para processar */}
      {analiseClientes && (
        <div className="mb-6">
          <button
            onClick={processarPlanilha}
            disabled={loading || !file}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : 'Processar e Distribuir Audiências Automaticamente'}
          </button>
        </div>
      )}

      {/* Resultados */}
      {processedData && (
        <div className="p-4 border rounded-lg bg-green-50">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Planilha Processada com Sucesso!</h3>
          <div className="mb-4">
            <p className="text-sm text-green-700">
              Divisões criadas: {Object.keys(processedData).length} | Total de registros: {planilhaUnificada?.length || 0}
            </p>
            <ul className="list-disc list-inside text-sm text-green-700 mt-2">
              {Object.keys(processedData).map(chave => (
                <li key={chave}>
                  {chave}: {processedData[chave].length} registros (distribuídos automaticamente)
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-4">
            <button
              onClick={baixarPlanilhasDivididas}
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700"
            >
              Baixar Planilhas Separadas
            </button>
            <button
              onClick={baixarPlanilhaUnificada}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700"
            >
              Baixar Planilha Unificada
            </button>
          </div>
        </div>
      )}

      {/* Informações sobre fuso horário */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Informações Importantes:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• A planilha é analisada automaticamente ao fazer upload</li>
          <li>• Sugestões de advogados são baseadas na quantidade de audiências por cliente</li>
          <li>• As audiências são distribuídas automaticamente entre os advogados configurados</li>
          <li>• Respeitado intervalo mínimo de 1 hora entre audiências do mesmo advogado</li>
          <li>• As horas são ajustadas automaticamente para o fuso horário de Salvador (SSA - UTC-3)</li>
          <li>• Opção de baixar planilhas separadas por cliente/tipo ou planilha unificada</li>
        </ul>
      </div>
    </div>
  );
}

export default NewAutomationPage;

