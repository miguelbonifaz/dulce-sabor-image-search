import ImageCard from './ImageCard'

export default function ImageGrid({ images, selectedIndex, onSelect }) {
  if (!images.length) return null

  return (
    <div className="grid">
      {images.map((image, index) => (
        <ImageCard
          key={image.position || index}
          image={image}
          selected={selectedIndex === index}
          disabled={selectedIndex !== null && selectedIndex !== index}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  )
}
