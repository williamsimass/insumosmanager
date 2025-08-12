import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Search, Edit, Trash2 } from 'lucide-react'

const InsumosList = ({ insumos, onUpdateInsumo, onDeleteInsumo }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCentroCusto, setFilterCentroCusto] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const statusOptions = [
    'Não autorizado', 'Entregue', 'Aguardando autorização', 
    'Aguardando compra', 'Sem resposta', 'No financeiro'
  ]

  const centrosCusto = [
    'BMG', 'Bradesco', 'Controladoria', 'PAN', 'DIGIO', 
    'Return', 'LATAM', 'Too Seguros', 'Outros'
  ]

  const aprovadores = ['Yan Meireles', 'Walter Cardoso']

  // Filtrar insumos
  const filteredInsumos = insumos
    .filter(insumo => {
      const matchesSearch =
        (insumo.solicitante || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (insumo.equipamento || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (insumo.numeroChamado || '').toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !filterStatus || insumo.status === filterStatus
      const matchesCentroCusto = !filterCentroCusto || insumo.centroCusto === filterCentroCusto

      // Filtrar por data
      const insumoDate = insumo.dataSolicitacao ? new Date(insumo.dataSolicitacao) : null
      const matchesStart = !startDate || (insumoDate && insumoDate >= new Date(startDate))
      const matchesEnd = !endDate || (insumoDate && insumoDate <= new Date(endDate))

      return matchesSearch && matchesStatus && matchesCentroCusto && matchesStart && matchesEnd
    })
    // Ordenar por data
    .sort((a, b) => {
      const dateA = a.dataSolicitacao ? new Date(a.dataSolicitacao) : new Date(0)
      const dateB = b.dataSolicitacao ? new Date(b.dataSolicitacao) : new Date(0)
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregue': return 'bg-green-100 text-green-800'
      case 'Não autorizado': return 'bg-red-100 text-red-800'
      case 'Aguardando autorização': return 'bg-yellow-100 text-yellow-800'
      case 'Aguardando compra': return 'bg-blue-100 text-blue-800'
      case 'No financeiro': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEdit = (insumo) => {
    setEditingId(insumo.id)
    setEditData(insumo)
  }

  const handleSaveEdit = () => {
    onUpdateInsumo(editData)
    setEditingId(null)
    setEditData({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Lista de Insumos ({filteredInsumos.length})
        </CardTitle>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-wrap md:flex-row gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              type="text"
              placeholder="Buscar por solicitante, equipamento ou chamado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="w-full md:w-48">
            <Label htmlFor="filterStatus">Status</Label>
            <select 
              id="filterStatus"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <Label htmlFor="filterCentroCusto">Centro</Label>
            <select 
              id="filterCentroCusto"
              value={filterCentroCusto} 
              onChange={(e) => setFilterCentroCusto(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos</option>
              {centrosCusto.map((centro) => (
                <option key={centro} value={centro}>
                  {centro}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="w-full md:w-48">
            <Label htmlFor="endDate">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="w-full md:w-48">
            <Label htmlFor="sortOrder">Ordenar por Data</Label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Data Solicitação</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Solicitante</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Centro de Custo</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Equipamento</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Valor</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Aprovado Por</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Chamado</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInsumos.map((insumo) => (
                <tr key={insumo.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {editingId === insumo.id ? (
                      <Input
                        type="date"
                        value={editData.dataSolicitacao}
                        onChange={(e) => setEditData({...editData, dataSolicitacao: e.target.value})}
                        className="w-32"
                      />
                    ) : (
                      formatDate(insumo.dataSolicitacao)
                    )}
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    {editingId === insumo.id ? (
                      <Input
                        value={editData.solicitante}
                        onChange={(e) => setEditData({...editData, solicitante: e.target.value})}
                        className="w-32"
                      />
                    ) : (
                      insumo.solicitante
                    )}
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    {editingId === insumo.id ? (
                      <select 
                        value={editData.centroCusto} 
                        onChange={(e) => setEditData({...editData, centroCusto: e.target.value})}
                        className="w-32 px-2 py-1 border border-gray-300 rounded"
                      >
                        {centrosCusto.map((centro) => (
                          <option key={centro} value={centro}>
                            {centro}
                          </option>
                        ))}
                      </select>
                    ) : (
                      insumo.centroCusto
                    )}
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    {editingId === insumo.id ? (
                      <Input
                        value={editData.equipamento}
                        onChange={(e) => setEditData({...editData, equipamento: e.target.value})}
                        className="w-32"
                      />
                    ) : (
                      insumo.equipamento || '-'
                    )}
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    {editingId === insumo.id ? (
                      <select 
                        value={editData.status} 
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                        className="w-40 px-2 py-1 border border-gray-300 rounded"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(insumo.status)}`}>
                        {insumo.status || 'Sem status'}
                      </span>
                    )}
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    {editingId === insumo.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editData.valor}
                        onChange={(e) => setEditData({...editData, valor: parseFloat(e.target.value) || 0})}
                        className="w-24"
                      />
                    ) : (
                      formatCurrency(insumo.valor)
                    )}
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    {editingId === insumo.id ? (
                      <select 
                        value={editData.aprovadoPor} 
                        onChange={(e) => setEditData({...editData, aprovadoPor: e.target.value})}
                        className="w-32 px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="">Selecione</option>
                        {aprovadores.map((aprovador) => (
                          <option key={aprovador} value={aprovador}>
                            {aprovador}
                          </option>
                        ))}
                      </select>
                    ) : (
                      insumo.aprovadoPor || '-'
                    )}
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    {editingId === insumo.id ? (
                      <Input
                        value={editData.numeroChamado}
                        onChange={(e) => setEditData({...editData, numeroChamado: e.target.value})}
                        className="w-24"
                      />
                    ) : (
                      insumo.numeroChamado || '-'
                    )}
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2">
                      {editingId === insumo.id ? (
                        <>
                          <Button size="sm" onClick={handleSaveEdit}>
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(insumo)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => onDeleteInsumo(insumo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredInsumos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum insumo encontrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default InsumosList
