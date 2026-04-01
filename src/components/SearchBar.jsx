export default function SearchBar({ query, onChange, onSearch, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch()
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search__input"
        placeholder="ej: coffee cake fondant"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="search__btn"
        disabled={loading || !query.trim()}
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  )
}
