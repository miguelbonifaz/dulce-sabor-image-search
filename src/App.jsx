import { useState, useEffect, useCallback, useRef } from 'react'
import SearchBar from './components/SearchBar'
import ImageGrid from './components/ImageGrid'
import ConfirmModal from './components/ConfirmModal'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''

function App() {
  const [query, setQuery] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const autoSearchDone = useRef(false)

  // Read query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const imageQuery = params.get('image') || ''

    if (imageQuery && !autoSearchDone.current) {
      autoSearchDone.current = true
      setQuery(imageQuery)
    }
  }, [])

  const searchImages = useCallback(async (searchQuery) => {
    const q = searchQuery || query
    if (!q.trim()) return

    setLoading(true)
    setError(null)
    setImages([])
    setSelectedIndex(null)
    setShowModal(false)
    setHasSearched(true)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudieron obtener las imágenes.`)
      }

      const data = await res.json()
      const results = data.images_results || []

      if (!results.length) {
        setError('No se encontraron imágenes para esta búsqueda.')
      }

      setImages(results)
    } catch (err) {
      setError(err.message || 'Ocurrió un error al buscar imágenes.')
    } finally {
      setLoading(false)
    }
  }, [query])

  // Auto-search when query is set from URL param
  useEffect(() => {
    if (query && autoSearchDone.current && !hasSearched) {
      searchImages(query)
    }
  }, [query, hasSearched, searchImages])

  const handleSelect = (index) => {
    setSelectedIndex(index)
    setShowModal(true)
  }

  const handleConfirm = async () => {
    const number = WHATSAPP_NUMBER
    const imageUrl =
      selectedImage?.original || selectedImage?.image || selectedImage?.thumbnail || ''
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 5000)

    try {
      await fetch('https://zilver-n8n.flowship.dev/webhook/c6e0bd72-3dda-422b-af75-8055858004fd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number,
          imageUrl,
        }),
        signal: controller.signal,
      })
    } catch (err) {
      console.error('No se pudo enviar la selección al webhook.', err)
    } finally {
      window.clearTimeout(timeoutId)
    }

    if (number) {
      window.location.href = `https://wa.me/${number}`
    } else {
      window.location.href = 'https://wa.me/'
    }
  }

  const handleCancel = () => {
    setSelectedIndex(null)
    setShowModal(false)
  }

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null

  return (
    <div className="app">
      <header className="brand">
        <h1 className="brand__title">
          Dulce <em>Sabor</em>
        </h1>
        <p className="brand__subtitle">Escoge la imagen perfecta</p>
      </header>

      <SearchBar
        query={query}
        onChange={setQuery}
        onSearch={() => searchImages()}
        loading={loading}
      />

      {loading && (
        <div className="loader">
          <div className="loader__dots">
            <span className="loader__dot" />
            <span className="loader__dot" />
            <span className="loader__dot" />
          </div>
          <span className="loader__text">Buscando imágenes</span>
        </div>
      )}

      {error && !loading && (
        <div className="error">
          <p className="error__text">{error}</p>
        </div>
      )}

      {!loading && !error && hasSearched && images.length === 0 && (
        <div className="empty">
          <div className="empty__icon">🔍</div>
          <p className="empty__text">
            No se encontraron resultados
          </p>
        </div>
      )}

      {!loading && images.length > 0 && (
        <ImageGrid
          images={images}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
        />
      )}

      {showModal && selectedImage && (
        <ConfirmModal
          image={selectedImage}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default App
