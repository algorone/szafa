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
import './sprawaview.css';
import { useView } from '@/lib/view';
import { Sprawa } from './sprawa';
import { useList } from '@/lib/list';
import { usePagina } from '@/lib/pagina';
import { useZnakRwa } from '@/lib/znakRwa';

interface SprawaViewProps {
  children?: React.ReactNode;
}

const SprawaView: React.FC<SprawaViewProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [page, setPage] = useView()
  const [list, setList] = useList()
  const [pagina, setPagina] = usePagina()
  const [znakRwa, setZnakRwa] = useZnakRwa()


  const handleOpen = () => {
    setIsOpen(true);

  };

  const handleClose = () => {
    setIsOpen(false);
    setPage('sprawy')

  };

  const nextSprawa = () => {
    const idx = list.findIndex((spr: any) => spr?.znak === znakRwa)
    if (idx < list.length) {
      const nextZnak = list[idx + 1].znak
      setZnakRwa(nextZnak)
    }
  }

  const previousSprawa = () => {
    const idx = list.findIndex((spr: any) => spr?.znak === znakRwa)
    if (idx > 0) {
      const nextZnak = list[idx - 1].znak
      setZnakRwa(nextZnak)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent, location: string) => {
      console.log("Wywelonie z  " + location)
      if (e.key === 'Escape' && location === 'SprawaView') {
        handleClose();
      }
    };
    const myHandleEscape = (e: KeyboardEvent) => handleEscape(e, 'SprawaView')

    if (isOpen) {
      document.addEventListener('keydown', myHandleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', myHandleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (isOpen) {
    return (

      <div className="sprawa-view-overlay" onClick={handleClose}>
        <button
          className="sprawa-view-close"
          onClick={handleClose}
          aria-label="Zamknij podgląd sprawy"
        >
          &times;
        </button>
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="sprawa-view-previous"
            onClick={previousSprawa}
            aria-label="poprzednia"
          >
            &lt;
          </button>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="sprawa-view-next"
            onClick={nextSprawa}
            aria-label="następna"
          >
            &gt;
          </button>
        </div>

        <div className="sprawa-view-container" onClick={(e) =>
          e.stopPropagation()}>
          <Sprawa />
        </div>
      </div>

    );
  }

  return (
    <span className="sprawa-view-link-container" onClick={handleOpen}>
      {children}
    </span>
  );
};

export default SprawaView;
