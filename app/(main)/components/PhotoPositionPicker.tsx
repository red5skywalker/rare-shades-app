'use client'

import { useState, useRef } from 'react'

interface PhotoPositionPickerProps {
  src: string
  initialPosition?: string
  name?: string
}

export default function PhotoPositionPicker({
  src,
  initialPosition = '50% 50%',
  name = 'photo_position',
}: PhotoPositionPickerProps) {
  const parsePos = (pos: string) => {
    const parts = pos.match(/(\d+)%\s+(\d+)%/)
    return { x: parts ? parseInt(parts[1]) : 50, y: parts ? parseInt(parts[2]) : 50 }
  }

  const [pos, setPos] = useState(() => parsePos(initialPosition))
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const positionString = `${Math.round(pos.x)}% ${Math.round(pos.y)}%`

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: pos.x, startPosY: pos.y }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Dragging right → image pans left → x decreases; dragging down → image pans up → y decreases
    const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100
    const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100
    setPos({
      x: Math.round(Math.max(0, Math.min(100, dragRef.current.startPosX - dx))),
      y: Math.round(Math.max(0, Math.min(100, dragRef.current.startPosY - dy))),
    })
  }

  function onPointerUp() {
    dragRef.current = null
  }

  return (
    <div className="photo-position-picker">
      <div
        ref={containerRef}
        className="photo-position-preview"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        title="Drag to reposition"
      >
        <img
          src={src}
          alt="Reposition preview"
          style={{ objectPosition: positionString }}
          draggable={false}
        />
        <div className="photo-position-crosshair" aria-hidden="true" />
        <span className="photo-position-hint">Drag to reposition</span>
      </div>
      <input type="hidden" name={name} value={positionString} />
    </div>
  )
}
