export default function ImageCard({ image, selected, disabled, onClick }) {
  const classes = [
    'card',
    selected && 'card--selected',
    disabled && 'card--disabled',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} onClick={disabled ? undefined : onClick}>
      <img
        className="card__img"
        src={image.thumbnail}
        alt={image.title || 'Imagen'}
        loading="lazy"
      />
    </div>
  )
}
