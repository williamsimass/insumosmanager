import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Search, Edit, Trash2, ExternalLink, Plus, X, Building } from 'lucide-react'

const FornecedoresList = ({ fornecedores, onUpdateFornecedor, onDeleteFornecedor }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  // Filtrar fornecedores
  const filteredFornecedores = fornecedores.filter(fornecedor => 
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fornecedor.descricao || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (fornecedor) => {
    setEditingId(fornecedor.id)
    setEditData({
      ...fornecedor,
      links: fornecedor.links || ['']
    })
  }

  const handleSaveEdit = async () => {
    try {
      // Filtrar links vazios
      const linksValidos = editData.links.filter(link => link.trim() !== '')
      
      const fornecedorAtualizado = {
        ...editData,
        links: linksValidos
      }
      
      await onUpdateFornecedor(fornecedorAtualizado)
      setEditingId(null)
      setEditData({})
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error)
      alert('Erro ao atualizar fornecedor. Tente novamente.')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja remover o fornecedor "${nome}"?`)) {
      try {
        await onDeleteFornecedor(id)
      } catch (error) {
        console.error('Erro ao deletar fornecedor:', error)
        alert('Erro ao remover fornecedor. Tente novamente.')
      }
    }
  }

  const handleLinkChange = (index, value) => {
    const newLinks = [...editData.links]
    newLinks[index] = value
    setEditData(prev => ({
      ...prev,
      links: newLinks
    }))
  }

  const addLinkField = () => {
    setEditData(prev => ({
      ...prev,
      links: [...prev.links, '']
    }))
  }

  const removeLinkField = (index) => {
    if (editData.links.length > 1) {
      const newLinks = editData.links.filter((_, i) => i !== index)
      setEditData(prev => ({
        ...prev,
        links: newLinks
      }))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Lista de Fornecedores ({filteredFornecedores.length})
        </CardTitle>
        
        {/* Filtro de Busca */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <Label htmlFor="search">Buscar Fornecedor</Label>
            <Input
              id="search"
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredFornecedores.map((fornecedor) => (
            <Card key={fornecedor.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                {editingId === fornecedor.id ? (
                  // Modo de Edição
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edit-nome-${fornecedor.id}`}>Nome</Label>
                        <Input
                          id={`edit-nome-${fornecedor.id}`}
                          value={editData.nome}
                          onChange={(e) => setEditData({...editData, nome: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Data de Criação</Label>
                        <Input
                          value={formatDate(fornecedor.dataCriacao)}
                          disabled
                          className="mt-1 bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`edit-descricao-${fornecedor.id}`}>Descrição</Label>
                      <Textarea
                        id={`edit-descricao-${fornecedor.id}`}
                        value={editData.descricao}
                        onChange={(e) => setEditData({...editData, descricao: e.target.value})}
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Links</Label>
                      {editData.links.map((link, index) => (
                        <div key={index} className="flex gap-2 mt-2">
                          <Input
                            type="url"
                            value={link}
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                            placeholder="https://exemplo.com"
                            className="flex-1"
                          />
                          {editData.links.length > 1 && (
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
                    
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveEdit}>
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Modo de Visualização
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{fornecedor.nome}</h3>
                        <p className="text-sm text-gray-500">
                          Criado em: {formatDate(fornecedor.dataCriacao)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(fornecedor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(fornecedor.id, fornecedor.nome)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {fornecedor.descricao && (
                      <p className="text-gray-700 mb-4">{fornecedor.descricao}</p>
                    )}
                    
                    {fornecedor.links && fornecedor.links.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Links:</h4>
                        <div className="flex flex-wrap gap-2">
                          {fornecedor.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Link {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredFornecedores.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum fornecedor encontrado</p>
              {searchTerm && (
                <p className="text-sm">Tente ajustar os termos de busca</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FornecedoresList

