import { useEffect, useRef } from 'react'

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let width = 0, height = 0, frame = 0
    let dust: Array<{ x: number; y: number; r: number; v: number; a: number }> = []
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25)
      width = rect.width; height = rect.height
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      dust = Array.from({ length: Math.min(26, Math.max(12, Math.round(width / 48))) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 1.2 + .35, v: Math.random() * .11 + .025, a: Math.random() * .18 + .04,
      }))
    }
    const draw = () => {
      context.clearRect(0, 0, width, height)
      for (const particle of dust) {
        particle.y -= particle.v
        if (particle.y < -3) { particle.y = height + 3; particle.x = Math.random() * width }
        context.beginPath(); context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
        context.fillStyle = `rgba(239, 194, 199, ${particle.a})`; context.fill()
      }
      frame = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener('resize', resize)
    const visibility = () => { if (document.hidden) cancelAnimationFrame(frame); else draw() }
    document.addEventListener('visibilitychange', visibility)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  return <canvas className="atmosphere-canvas" ref={canvasRef} aria-hidden="true"/>
}
