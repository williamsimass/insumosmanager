import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, Calendar, Building } from 'lucide-react'

const Dashboard = ({ insumos }) => {
  const [filterPeriod, setFilterPeriod] = useState('month')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1']

  // Função para filtrar insumos por período
  const getFilteredInsumos = useMemo(() => {
    const now = new Date()
    let startDate = new Date()

    switch (filterPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3months':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate)
          const endDate = new Date(customEndDate)
          return insumos.filter(insumo => {
            const insumoDate = new Date(insumo.dataSolicitacao)
            return insumoDate >= startDate && insumoDate <= endDate
          })
        }
        return insumos
      default:
        return insumos
    }

    return insumos.filter(insumo => {
      const insumoDate = new Date(insumo.dataSolicitacao)
      return insumoDate >= startDate
    })
  }, [insumos, filterPeriod, customStartDate, customEndDate])

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalGasto = getFilteredInsumos.reduce((sum, insumo) => sum + (insumo.valor || 0), 0)
    const totalInsumos = getFilteredInsumos.length
    
    // Gastos por centro de custo
    const gastosPorCentro = getFilteredInsumos.reduce((acc, insumo) => {
      const centro = insumo.centroCusto || 'Não informado'
      acc[centro] = (acc[centro] || 0) + (insumo.valor || 0)
      return acc
    }, {})

    // Gastos por status
    const gastosPorStatus = getFilteredInsumos.reduce((acc, insumo) => {
      const status = insumo.status || 'Sem status'
      acc[status] = (acc[status] || 0) + (insumo.valor || 0)
      return acc
    }, {})

    // Gastos por mês (últimos 6 meses)
    const gastosPorMes = {}
    const last6Months = []
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      last6Months.push(monthKey)
      gastosPorMes[monthKey] = 0
    }

    getFilteredInsumos.forEach(insumo => {
      const insumoDate = new Date(insumo.dataSolicitacao)
      const monthKey = insumoDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      if (gastosPorMes.hasOwnProperty(monthKey)) {
        gastosPorMes[monthKey] += (insumo.valor || 0)
      }
    })

    return {
      totalGasto,
      totalInsumos,
      gastosPorCentro,
      gastosPorStatus,
      gastosPorMes: last6Months.map(month => ({
        month,
        valor: gastosPorMes[month]
      }))
    }
  }, [getFilteredInsumos])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getPeriodLabel = () => {
    switch (filterPeriod) {
      case 'week': return 'Última Semana'
      case 'month': return 'Último Mês'
      case '3months': return 'Últimos 3 Meses'
      case 'custom': return 'Período Personalizado'
      default: return 'Todos os Períodos'
    }
  }

  // Dados para gráfico de pizza - Centro de Custo
  const pieDataCentro = Object.entries(metrics.gastosPorCentro).map(([centro, valor]) => ({
    name: centro,
    value: valor
  })).filter(item => item.value > 0)

  // Dados para gráfico de pizza - Status
  const pieDataStatus = Object.entries(metrics.gastosPorStatus).map(([status, valor]) => ({
    name: status,
    value: valor
  })).filter(item => item.value > 0)

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros do Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-48">
              <Label htmlFor="period">Período</Label>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                  <SelectItem value="3months">Últimos 3 Meses</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterPeriod === 'custom' && (
              <>
                <div className="w-full md:w-48">
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Label htmlFor="endDate">Data Final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalGasto)}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Insumos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalInsumos}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalInsumos > 0 ? metrics.totalGasto / metrics.totalInsumos : 0)}
            </div>
            <p className="text-xs text-muted-foreground">Por insumo</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Gastos por Mês */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.gastosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Valor']} />
                <Bar dataKey="valor" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Gastos por Centro de Custo */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Centro de Custo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieDataCentro}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieDataCentro.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value), 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Gastos por Centro de Custo */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Centro de Custo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(metrics.gastosPorCentro)
              .sort(([,a], [,b]) => b - a)
              .map(([centro, valor]) => (
                <div key={centro} className="flex justify-between items-center p-2 border rounded">
                  <span className="font-medium">{centro}</span>
                  <span className="text-lg font-bold">{formatCurrency(valor)}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

