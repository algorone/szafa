/*
 * Copyright (C) 2026 Algor Informatyzcja Przedsiębiorstw Sp. z o.o.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://gnu.org>.
 */
import React, { useState, useEffect } from 'react';
import './PDFPreview.css';

interface PDFPreviewProps {
  url: string;
  children?: React.ReactNode;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ url, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setLoadedUrl(url);
  };

  const handleClose = () => {
    setIsOpen(false);
    setLoadedUrl(null);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent, location: string) => {
      console.log("Wywołanie z " + location)
      if (e.key === 'Escape' && location === 'PDFPreview') {
        handleClose();
        e.stopPropagation()
      }
    };

    const myPDFVHandleEscape = (e: KeyboardEvent)=>handleEscape(e, 'PDFPreview')

    if (isOpen) {
      document.addEventListener('keydown', myPDFVHandleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', myPDFVHandleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (isOpen) {
    return (
      <div className="pdf-preview-overlay" onClick={handleClose}>
        <button
          className="pdf-preview-close"
          onClick={handleClose}
          aria-label="Zamknij podgląd PDF"
        >
          &times;
        </button>
        <div className="pdf-preview-container" onClick={(e) =>
          e.stopPropagation()}>

          {loadedUrl ? (
            <object
              data={loadedUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              title="Podgląd PDF"
            />
          ) : (
            <div className="pdf-preview-loading">
              Ładowanie dokumentu...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <span className="pdf-preview-link-container" onClick={handleOpen}>
      {children}
    </span>
  );
};

export default PDFPreview;
