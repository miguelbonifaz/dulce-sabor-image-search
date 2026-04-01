export default function ConfirmModal({ image, onConfirm, onCancel }) {
  if (!image) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <img
          className="modal__preview"
          src={image.thumbnail}
          alt={image.title || 'Imagen seleccionada'}
        />
        <h3 className="modal__title">Confirmar imagen</h3>
        <p className="modal__text">
          Deseas seleccionar esta imagen?
        </p>
        <div className="modal__actions">
          <button
            className="modal__btn modal__btn--confirm"
            onClick={onConfirm}
          >
            Sí, confirmar
          </button>
          <button
            className="modal__btn modal__btn--cancel"
            onClick={onCancel}
          >
            No, elegir otra
          </button>
        </div>
      </div>
    </div>
  )
}
