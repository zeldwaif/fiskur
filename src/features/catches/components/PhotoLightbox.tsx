import { useEffect } from "react";

/**
 * Full-screen viewer for a catch photo. Deliberately dependency-free: a fixed overlay,
 * closed by the backdrop, the close button, or Escape. Body scroll is locked while open
 * so the page behind doesn't move under the overlay.
 */
export function PhotoLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="fk-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <button className="fk-lightbox__close" type="button" aria-label="Close photo" onClick={onClose}>
        ×
      </button>
      {/* Stop propagation so clicking the photo itself doesn't close the overlay. */}
      <img className="fk-lightbox__img" src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
