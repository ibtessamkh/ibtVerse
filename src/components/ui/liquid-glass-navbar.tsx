"use client"

import * as React from "react"

export type NimbusFx = "plane" | "drop" | "spin" | "glow" | "wave" | "pop" | "none"
export type LiquidNavItem = {
  label: string
  href?: string
  icon?: React.ReactNode
  fx?: NimbusFx
}
export type LiquidNavbarProps = {
  items?: LiquidNavItem[]
  defaultActive?: number
  active?: number
  onChange?: (index: number, item: LiquidNavItem) => void
  tone?: "light" | "dark"
  compact?: boolean
  sound?: boolean
  className?: string
  style?: React.CSSProperties
}

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)
export const NimbusIcons = {
  home: <Icon><path d="M3.5 11.2 12 4l8.5 7.2M6 9.6V20h12V9.6M10 20v-5h4v5" /></Icon>,
  globe: <Icon><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" /></Icon>,
  plane: <Icon><path d="M21 12.2 3.6 5.4l2.7 6.8-2.7 6.4L21 12.2Zm-14.7 0H13" /></Icon>,
  drop: <Icon><path d="M12 3.5s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z" /></Icon>,
  user: <Icon><circle cx="12" cy="8.5" r="3.8" /><path d="M4.8 20c1.2-3.4 4-5 7.2-5s6 1.6 7.2 5" /></Icon>,
}

const DEFAULT_ITEMS: LiquidNavItem[] = [
  { label: "Home", icon: NimbusIcons.home, fx: "glow" },
  { label: "Explore", icon: NimbusIcons.globe, fx: "spin" },
  { label: "Flights", icon: NimbusIcons.plane, fx: "plane" },
  { label: "Weather", icon: NimbusIcons.drop, fx: "drop" },
  { label: "Profile", icon: NimbusIcons.user, fx: "wave" },
]

const CSS = `
.liquid-nav{--nav-fg:#0b132b;--nav-muted:rgba(11,19,43,.64);position:relative;isolation:isolate;display:inline-flex;align-items:center;gap:2px;padding:6px;border-radius:999px;font:500 14px/1 ui-sans-serif,system-ui,sans-serif;-webkit-tap-highlight-color:transparent}
.liquid-nav[data-tone=dark]{--nav-fg:#f1f7ff;--nav-muted:rgba(241,247,255,.7)}
.liquid-nav-glass{position:absolute;z-index:-2;inset:0;overflow:hidden;border:1px solid rgba(255,255,255,.48);border-radius:inherit;background:rgba(255,255,255,.25);box-shadow:inset 0 1px 2px rgba(255,255,255,.72),0 12px 32px -14px rgba(0,40,90,.5);backdrop-filter:blur(16px) saturate(1.3)}
.liquid-nav[data-tone=dark] .liquid-nav-glass{background:rgba(10,18,40,.35);border-color:rgba(255,255,255,.3)}
.liquid-nav-glass:after{position:absolute;inset:-40%;pointer-events:none;border-radius:50%;background:radial-gradient(ellipse at var(--mx,50%) 50%,rgba(255,255,255,.3),transparent 35%);content:""}
.liquid-nav-drop{position:absolute;z-index:-1;top:6px;bottom:6px;left:0;width:var(--drop-w,80px);transform:translateX(var(--drop-x,0));border:1px solid rgba(255,255,255,.78);border-radius:999px;background:radial-gradient(120% 150% at 30% 0%,rgba(255,255,255,.8),rgba(255,255,255,.14) 58%),rgba(130,204,255,.27);box-shadow:inset 0 1px 2px white,inset 0 -3px 9px rgba(0,162,255,.18),0 5px 15px rgba(0,60,120,.2);transition:transform .62s cubic-bezier(.2,.9,.2,1),width .45s ease}
.liquid-nav-item{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 16px;border:0;border-radius:999px;background:transparent;color:var(--nav-muted);font:inherit;text-decoration:none;white-space:nowrap;cursor:pointer;transition:color .2s}
.liquid-nav-item:hover,.liquid-nav-item[aria-current=page]{color:var(--nav-fg)}.liquid-nav-item:focus-visible{outline:2px solid #168bea;outline-offset:3px}
.liquid-nav-icon{display:inline-flex;flex:none}.liquid-nav-icon svg{transition:transform .35s cubic-bezier(.3,1.5,.5,1)}.liquid-nav-item[aria-current=page] .liquid-nav-icon svg{transform:translateY(-1px) scale(1.08)}
.liquid-nav-icon[data-fx=spin] svg{animation:liquid-spin .65s ease}.liquid-nav-icon[data-fx=glow] svg,.liquid-nav-icon[data-fx=pop] svg{animation:liquid-pop .55s ease}.liquid-nav-icon[data-fx=wave] svg{animation:liquid-wave .7s ease}.liquid-nav-icon[data-fx=drop] svg{animation:liquid-drop .75s ease}.liquid-nav-icon[data-fx=plane] svg{animation:liquid-flight .85s ease}
@keyframes liquid-spin{to{transform:rotateY(360deg)}}@keyframes liquid-pop{50%{transform:translateY(-5px) scale(1.16)}}@keyframes liquid-wave{25%{transform:rotate(-14deg)}65%{transform:rotate(12deg)}}@keyframes liquid-drop{25%{transform:translateY(-8px) scale(.9,1.12)}55%{transform:translateY(2px) scale(1.16,.82)}}@keyframes liquid-flight{45%{transform:translate(13px,-10px) rotate(-22deg);opacity:.2}}
.liquid-nav[data-compact=true] .liquid-nav-item{padding-inline:13px}.liquid-nav[data-compact=true] .liquid-nav-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
@media(max-width:520px){.liquid-nav:not([data-compact=false]) .liquid-nav-item{padding-inline:13px}.liquid-nav:not([data-compact=false]) .liquid-nav-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}}
@media(prefers-reduced-motion:reduce){.liquid-nav-drop,.liquid-nav-icon svg{transition:none!important;animation:none!important}}
`

export function LiquidNavbar({
  items = DEFAULT_ITEMS,
  defaultActive = 0,
  active,
  onChange,
  tone = "light",
  compact,
  sound = false,
  className,
  style,
}: LiquidNavbarProps) {
  const [innerActive, setInnerActive] = React.useState(defaultActive)
  const [fxState, setFxState] = React.useState({ index: -1, tick: 0 })
  const navRef = React.useRef<HTMLElement | null>(null)
  const itemRefs = React.useRef<Array<HTMLElement | null>>([])
  const current = active ?? innerActive

  const placeDrop = React.useCallback(() => {
    const nav = navRef.current
    const item = itemRefs.current[current]
    if (!nav || !item) return
    const navBox = nav.getBoundingClientRect()
    const itemBox = item.getBoundingClientRect()
    nav.style.setProperty("--drop-x", `${itemBox.left - navBox.left}px`)
    nav.style.setProperty("--drop-w", `${itemBox.width}px`)
  }, [current, items.length])

  React.useLayoutEffect(() => {
    placeDrop()
    const observer = typeof ResizeObserver !== "undefined" && navRef.current
      ? new ResizeObserver(placeDrop)
      : null
    if (observer && navRef.current) observer.observe(navRef.current)
    return () => observer?.disconnect()
  }, [placeDrop])

  const playSound = React.useCallback(() => {
    if (!sound || typeof window === "undefined") return
    try {
      const Audio = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Audio) return
      const context = new Audio()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(480, context.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(1150, context.currentTime + 0.06)
      gain.gain.setValueAtTime(0.0001, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.13)
      oscillator.onended = () => void context.close()
    } catch { /* Audio is an optional enhancement. */ }
  }, [sound])

  const select = (index: number) => {
    const item = items[index]
    if (!item) return
    setFxState(state => ({ index, tick: state.tick + 1 }))
    playSound()
    if (index !== current) {
      if (active === undefined) setInnerActive(index)
      onChange?.(index, item)
    }
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const next = (current + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length
    select(next)
    itemRefs.current[next]?.focus()
  }

  return (
    <nav
      ref={navRef}
      className={["liquid-nav", className].filter(Boolean).join(" ")}
      data-tone={tone}
      data-compact={compact === undefined ? undefined : String(compact)}
      aria-label="Main navigation"
      onKeyDown={handleKeyDown}
      onPointerMove={event => {
        if (event.pointerType === "mouse") {
          const rect = event.currentTarget.getBoundingClientRect()
          event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`)
        }
      }}
      style={style}
    >
      <style>{CSS}</style>
      <span className="liquid-nav-glass" aria-hidden="true" />
      <span className="liquid-nav-drop" aria-hidden="true" />
      {items.map((item, index) => {
        const fx = fxState.index === index ? item.fx ?? (item.icon ? "pop" : "none") : undefined
        const content = <>
          {item.icon && <span key={`${fxState.tick}-${index}`} className="liquid-nav-icon" data-fx={fx}>{item.icon}</span>}
          <span className="liquid-nav-label">{item.label}</span>
        </>
        const common = {
          ref: (node: HTMLElement | null) => { itemRefs.current[index] = node },
          className: "liquid-nav-item",
          "aria-current": index === current ? "page" as const : undefined,
          "aria-label": item.label,
          onClick: () => select(index),
        }
        return item.href
          ? <a key={`${item.label}-${index}`} {...common} href={item.href}>{content}</a>
          : <button key={`${item.label}-${index}`} {...common} type="button">{content}</button>
      })}
    </nav>
  )
}

export { LiquidNavbar as Component }
export default LiquidNavbar
