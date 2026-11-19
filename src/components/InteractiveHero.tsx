import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { siteContent } from '../content'
import { allFrameNumbers, framePath, heroFrames, type HeroState } from '../heroFrames'

export function InteractiveHero() {
  const stageRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef(new Map<number, HTMLImageElement>())
  const rafRef = useRef(0)
  const stateRef = useRef<HeroState>('idle')
  const frameRef = useRef(heroFrames.idle.start)
  const sequenceRef = useRef<number[]>([])
  const sequenceIndexRef = useRef(0)
  const zoneTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const greetingLockedRef = useRef(false)
  const greetingRunningRef = useRef(false)
  const pointerInsideRef = useRef(false)
  const reduceMotion = useRef(false)
  const [loaded, setLoaded] = useState(0)
  const [zone, setZone] = useState<'left' | 'right' | 'center' | ''>('')
  const [message, setMessage] = useState<string>(siteContent.hero.instruction)
  const [isMobile, setIsMobile] = useState(false)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')

  const drawFrame = useCallback((number: number) => {
    const canvas = canvasRef.current
    const image = imagesRef.current.get(number)
    if (!canvas || !image?.complete || !image.naturalWidth) return
    const context = canvas.getContext('2d')
    if (!context) return
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const bounds = canvas.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const width = Math.round(bounds.width * ratio)
    const height = Math.round(bounds.height * ratio)
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height }
    context.clearRect(0, 0, width, height)
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight)
    const drawWidth = image.naturalWidth * scale
    const drawHeight = image.naturalHeight * scale
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
  }, [])

  const playState = useCallback((next: HeroState, onComplete?: () => void) => {
    cancelAnimationFrame(rafRef.current)
    window.clearTimeout(holdTimerRef.current)
    stateRef.current = next
    const range = heroFrames[next]
    sequenceRef.current = Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i)
    if (next === 'lookRight') sequenceRef.current.reverse()
    sequenceIndexRef.current = 0
    if (reduceMotion.current) { frameRef.current = range.start; drawFrame(frameRef.current); onComplete?.(); return }
    const stepMs = 1000 / range.fps
    let last = 0
    const tick = (now: number) => {
      if (!last) last = now
      if (now - last >= stepMs) {
        last = now
        const numbers = sequenceRef.current
        const index = sequenceIndexRef.current
        frameRef.current = numbers[Math.min(index, numbers.length - 1)]
        drawFrame(frameRef.current)
        if (index < numbers.length - 1) sequenceIndexRef.current += 1
        else if (range.loop) sequenceIndexRef.current = 0
        else { rafRef.current = 0; onComplete?.(); return }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [drawFrame])

  const greet = useCallback(() => {
    if (greetingRunningRef.current || greetingLockedRef.current) return
    greetingLockedRef.current = true
    greetingRunningRef.current = true
    setZone('center')
    setMessage(siteContent.hero.messages.greeting[0])
    playState('greeting', () => {
      greetingRunningRef.current = false
      setMessage(siteContent.hero.messages.greeting[2])
      if (!pointerInsideRef.current) greetingLockedRef.current = false
    })
    const lines = siteContent.hero.messages.greeting
    window.setTimeout(() => setMessage(lines[1]), 1100)
    window.setTimeout(() => { if (greetingRunningRef.current || stateRef.current === 'greeting') setMessage(lines[2]) }, 2200)
  }, [playState])

  const handleZone = useCallback((next: 'left' | 'right' | 'center') => {
    if (greetingRunningRef.current) return
    if (next === 'center') { greet(); return }
    if (greetingLockedRef.current) return
    window.clearTimeout(holdTimerRef.current)
    setZone(next)
    setMessage(next === 'left' ? siteContent.hero.messages.left : siteContent.hero.messages.right)
    const state = next === 'left' ? 'lookLeft' : 'lookRight'
    playState(state, () => {
      holdTimerRef.current = window.setTimeout(() => {
        setZone('')
        setMessage(siteContent.hero.instruction)
        playState('idle')
      }, 2400)
    })
  }, [greet, playState])

  const selectZone = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch' || isMobile) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const amount = (event.clientX - bounds.left) / bounds.width
    const next = amount < .34 ? 'left' : amount > .66 ? 'right' : 'center'
    window.clearTimeout(zoneTimerRef.current)
    zoneTimerRef.current = window.setTimeout(() => handleZone(next), 90)
  }, [handleZone, isMobile])

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const media = window.matchMedia('(max-width: 700px)')
    const updateMobile = () => setIsMobile(media.matches)
    updateMobile(); media.addEventListener('change', updateMobile)
    const onTheme = () => setTheme(document.documentElement.dataset.theme || 'light')
    const observer = new MutationObserver(onTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    let cancelled = false
    const preload = async () => {
      const idle = allFrameNumbers.filter(number => number >= heroFrames.idle.start && number <= heroFrames.idle.end)
      const remaining = allFrameNumbers.filter(number => !idle.includes(number))
      for (const number of [...idle, ...remaining]) {
        const image = new Image()
        image.decoding = 'async'
        const ready = new Promise<void>(resolve => { image.onload = () => resolve(); image.onerror = () => resolve() })
        image.src = framePath(number)
        await ready
        if (cancelled) return
        imagesRef.current.set(number, image)
        setLoaded(imagesRef.current.size)
        if (number === heroFrames.idle.start) drawFrame(number)
      }
      if (!cancelled) { frameRef.current = heroFrames.idle.start; drawFrame(frameRef.current) }
    }
    void preload()
    const resize = () => drawFrame(frameRef.current)
    window.addEventListener('resize', resize)
    return () => {
      cancelled = true
      media.removeEventListener('change', updateMobile)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.clearTimeout(zoneTimerRef.current); window.clearTimeout(holdTimerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [drawFrame])

  useEffect(() => {
    if (!isMobile) return
    const timer = window.setTimeout(greet, 1800)
    return () => window.clearTimeout(timer)
  }, [isMobile, greet])

  const onLeave = () => {
    window.clearTimeout(zoneTimerRef.current)
    if (!greetingRunningRef.current) {
      greetingLockedRef.current = false
      setZone('')
      setMessage(siteContent.hero.instruction)
      playState('idle')
    }
  }
  const progress = Math.min(100, Math.round((loaded / allFrameNumbers.length) * 100))
  return <section id="top" ref={stageRef} className={`hero-section theme-${theme}`} onPointerMove={selectZone} onPointerEnter={() => { pointerInsideRef.current = true }} onPointerLeave={() => { pointerInsideRef.current = false; onLeave() }}>
    <div className="hero-glow" aria-hidden="true"/><div className="hero-grain" aria-hidden="true"/>
    <div className="hero-copy-left"><span className="overline"><i/> {siteContent.labels.attribution}</span><h1>{siteContent.hero.name.split(' ')[0]}<br/><em>{siteContent.hero.name.split(' ').slice(1).join(' ')}</em></h1><p className="hero-role">{siteContent.hero.role}</p><button className="call-instruction" type="button" onClick={greet}><span className="cursor-spark" aria-hidden="true">↖</span>{isMobile ? siteContent.labels.tapInstruction : siteContent.hero.instruction}</button></div>
    <div className="hero-art" aria-label={siteContent.labels.heroAria} role="button" tabIndex={0} onClick={() => { if (isMobile && !greetingRunningRef.current) greetingLockedRef.current = false; if (isMobile || !greetingLockedRef.current) greet() }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); greet() } }}>
      <div className="portrait-aura" aria-hidden="true"/><canvas ref={canvasRef} className="hero-canvas" aria-label={siteContent.labels.canvasAria}/><span className="frame-placeholder">{siteContent.hero.placeholder}</span>
      {loaded < allFrameNumbers.length && <div className="frame-loader" role="status"><span>{siteContent.hero.loading}</span><div><i style={{ width: `${progress}%` }}/></div></div>}
      <div className="hero-caption"><span>{siteContent.labels.caption[0]}</span><i>×</i><span>{siteContent.labels.caption[1]}</span></div>
    </div>
    <aside className="hero-side-message"><div key={message} className="hero-zone-message" aria-live="polite" aria-atomic="true">{message}</div></aside>
    <div className="hero-scroll"><span>{siteContent.hero.scroll}</span><a href="#about" aria-label={siteContent.labels.scrollAria}>↓</a></div>
    <span className={`zone-indicator ${zone}`} aria-hidden="true"/>
  </section>
}
