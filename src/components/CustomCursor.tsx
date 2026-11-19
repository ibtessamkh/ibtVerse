import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cursor = cursorRef.current
    if (!cursor) return
    document.documentElement.classList.add('has-custom-cursor')
    let frame = 0
    let x = 0, y = 0, targetX = 0, targetY = 0
    const move = (event: PointerEvent) => {
      targetX = event.clientX; targetY = event.clientY
      if (frame) return
      const tick = () => {
        x += (targetX - x) * .34; y += (targetY - y) * .34
        cursor.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`
        if (Math.abs(targetX - x) + Math.abs(targetY - y) > .4) frame = requestAnimationFrame(tick)
        else frame = 0
      }
      frame = requestAnimationFrame(tick)
    }
    const interactive = (event: PointerEvent) => cursor.classList.toggle('is-hovering', Boolean((event.target as HTMLElement | null)?.closest('a,button,[role="button"]')))
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', interactive, { passive: true })
    return () => { document.documentElement.classList.remove('has-custom-cursor'); cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', interactive) }
  }, [])
  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><i/></div>
}
