import { useState, useEffect } from 'react'

const useLocalStorage = (key, initialValue) => {
  // Função para obter o valor do localStorage
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Erro ao ler localStorage para a chave "${key}":`, error)
      return initialValue
    }
  }

  // Estado inicial
  const [storedValue, setStoredValue] = useState(getStoredValue)

  // Função para atualizar o valor
  const setValue = (value) => {
    try {
      // Permite que value seja uma função como no useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Salva no estado
      setStoredValue(valueToStore)
      
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Erro ao salvar no localStorage para a chave "${key}":`, error)
    }
  }

  // Sincroniza com mudanças no localStorage de outras abas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Erro ao sincronizar localStorage para a chave "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}

export default useLocalStorage

