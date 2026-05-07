import { useEffect } from "react";
import { X } from "lucide-react";

export default function LogoutConfirmModal({ open, onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="logout-modal-overlay" onClick={onCancel}>
      <div
        className="logout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logout-modal__head">
          <h3 id="logout-modal-title" className="logout-modal__title">Logout</h3>
          <button
            className="logout-modal__close"
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <p className="logout-modal__body">Do you wish to logout?</p>

        <div className="logout-modal__actions">
          <button className="logout-modal__btn logout-modal__btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="logout-modal__btn logout-modal__btn--confirm" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
