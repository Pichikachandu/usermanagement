const Modal = ({ isOpen, title, children, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">{title}</h3>
                <div style={{ margin: '1rem 0' }}>
                    {children}
                </div>
                <div className="modal-actions">
                    <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="btn btn-primary" style={{ width: 'auto' }} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
