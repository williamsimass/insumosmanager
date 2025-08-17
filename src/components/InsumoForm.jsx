import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { CalendarIcon, Plus } from 'lucide-react'

const InsumoForm = ({ onAddInsumo }) => {
  const [formData, setFormData] = useState({
    dataSolicitacao: '',
    dataAprovacao: '',
    aprovadoPor: '',
    solicitante: '',
    centroCusto: '',
    equipamento: '',
    status: '',
    numeroChamado: '',
    equipamentoQuantidade: '',
    valor: ''
  })

  const centrosCusto = [
    'BMG', 'Bradesco', 'Controladoria', 'PAN', 'DIGIO', 
    'Return', 'LATAM', 'Too Seguros', 'Outros', 'Itau'
  ]

  const statusOptions = [
    'Não autorizado', 'Entregue', 'Aguardando autorização', 
    'Aguardando compra', 'Sem resposta', 'No financeiro'
  ]

  const aprovadores = ['Yan Meireles', 'Walter Cardoso']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.dataSolicitacao || !formData.solicitante || !formData.centroCusto) {
      alert('Por favor, preencha os campos obrigatórios: Data de Solicitação, Solicitante e Centro de Custo')
      return
    }

    const novoInsumo = {
      id: Date.now(),
      ...formData,
      valor: parseFloat(formData.valor) || 0,
      dataCreated: new Date().toISOString()
    }

    onAddInsumo(novoInsumo)
    
    // Reset form
    setFormData({
      dataSolicitacao: '',
      dataAprovacao: '',
      aprovadoPor: '',
      solicitante: '',
      centroCusto: '',
      equipamento: '',
      status: '',
      numeroChamado: '',
      equipamentoQuantidade: '',
      valor: ''
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Adicionar Novo Insumo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Data de Solicitação */}
            <div className="space-y-2">
              <Label htmlFor="dataSolicitacao">Data de Solicitação *</Label>
              <Input
                id="dataSolicitacao"
                type="date"
                value={formData.dataSolicitacao}
                onChange={(e) => handleInputChange('dataSolicitacao', e.target.value)}
                required
              />
            </div>

            {/* Data de Aprovação */}
            <div className="space-y-2">
              <Label htmlFor="dataAprovacao">Data de Aprovação</Label>
              <Input
                id="dataAprovacao"
                type="date"
                value={formData.dataAprovacao}
                onChange={(e) => handleInputChange('dataAprovacao', e.target.value)}
              />
            </div>

            {/* Aprovado Por */}
            <div className="space-y-2">
              <Label htmlFor="aprovadoPor">Aprovado Por</Label>
              <Select value={formData.aprovadoPor} onValueChange={(value) => handleInputChange('aprovadoPor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o aprovador" />
                </SelectTrigger>
                <SelectContent>
                  {aprovadores.map((aprovador) => (
                    <SelectItem key={aprovador} value={aprovador}>
                      {aprovador}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Solicitante */}
            <div className="space-y-2">
              <Label htmlFor="solicitante">Solicitante *</Label>
              <Input
                id="solicitante"
                type="text"
                value={formData.solicitante}
                onChange={(e) => handleInputChange('solicitante', e.target.value)}
                placeholder="Nome do solicitante"
                required
              />
            </div>

            {/* Centro de Custo */}
            <div className="space-y-2">
              <Label htmlFor="centroCusto">Centro de Custo *</Label>
              <Select value={formData.centroCusto} onValueChange={(value) => handleInputChange('centroCusto', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o centro de custo" />
                </SelectTrigger>
                <SelectContent>
                  {centrosCusto.map((centro) => (
                    <SelectItem key={centro} value={centro}>
                      {centro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Equipamento */}
            <div className="space-y-2">
              <Label htmlFor="equipamento">Equipamento</Label>
              <Input
                id="equipamento"
                type="text"
                value={formData.equipamento}
                onChange={(e) => handleInputChange('equipamento', e.target.value)}
                placeholder="Descrição do equipamento"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Número do Chamado */}
            <div className="space-y-2">
              <Label htmlFor="numeroChamado">Número do Chamado</Label>
              <Input
                id="numeroChamado"
                type="text"
                value={formData.numeroChamado}
                onChange={(e) => handleInputChange('numeroChamado', e.target.value)}
                placeholder="Ex: CH-2024-001"
              />
            </div>

            {/* Equipamento e Quantidade */}
            <div className="space-y-2">
              <Label htmlFor="equipamentoQuantidade">Equipamento e Quantidade</Label>
              <Input
                id="equipamentoQuantidade"
                type="text"
                value={formData.equipamentoQuantidade}
                onChange={(e) => handleInputChange('equipamentoQuantidade', e.target.value)}
                placeholder="Ex: Notebook Dell - 2 unidades"
              />
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) => handleInputChange('valor', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Insumo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default InsumoForm

