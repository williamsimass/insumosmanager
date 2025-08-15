import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Plus, X, Link, Building } from 'lucide-react'

const FornecedorForm = ({ onAddFornecedor }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    links: ['']
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.links]
    newLinks[index] = value
    setFormData(prev => ({
      ...prev,
      links: newLinks
    }))
  }

  const addLinkField = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, '']
    }))
  }

  const removeLinkField = (index) => {
    if (formData.links.length > 1) {
      const newLinks = formData.links.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        links: newLinks
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.nome.trim()) {
      alert('Nome do fornecedor é obrigatório!')
      return
    }

    // Filtrar links vazios
    const linksValidos = formData.links.filter(link => link.trim() !== '')
    
    const fornecedorData = {
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      links: linksValidos
    }

    try {
      await onAddFornecedor(fornecedorData)
      
      // Limpar formulário
      setFormData({
        nome: '',
        descricao: '',
        links: ['']
      })
      
      alert('Fornecedor adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error)
      alert('Erro ao adicionar fornecedor. Tente novamente.')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Adicionar Novo Fornecedor
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do Fornecedor */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Fornecedor *</Label>
            <Input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Ex: Dell, HP, Logitech..."
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              placeholder="Descrição opcional do fornecedor..."
              rows={3}
            />
          </div>

          {/* Links */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Links do Fornecedor
            </Label>
            
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="https://exemplo.com"
                  className="flex-1"
                />
                
                {formData.links.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLinkField(index)}
                    className="px-3"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLinkField}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Link
            </Button>
          </div>

          {/* Botão Submit */}
          <div className="flex justify-end pt-4">
            <Button type="submit" className="min-w-32">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Fornecedor
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default FornecedorForm

