"use client"

import * as React from "react"

/** Deterministic helpers exported for composing and testing the doodle scene. */
export const hash = (n: number): number => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}
export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))
export const layoutWord = (advances: number[], tracking: number, fontSize: number) => {
  const x: number[] = [], w: number[] = []
  let at = 0
  const gap = (Number.isFinite(tracking) ? tracking : 0) * fontSize
  advances.forEach((advance, index) => {
    const width = Number.isFinite(advance) && advance > 0 ? advance : 0
    x.push(at); w.push(width); at += width + (index < advances.length - 1 ? gap : 0)
  })
  return { x, w, width: Math.max(0, at) }
}
export type Seat = "front" | "top" | "behind"
export const seatPoint = (seat: Seat, letterX: number, letterW: number, cap: number, offset: number, scale: number) => ({
  x: letterX + letterW * (.5 + (Number.isFinite(offset) ? offset : 0)),
  y: seat === "top" ? -cap : seat === "behind" ? -cap + 30 * scale : 0,
})
export const lookAt = (ex: number, ey: number, tx: number, ty: number, max: number, reach: number) => {
  const dx = tx - ex, dy = ty - ey, distance = Math.hypot(dx, dy)
  if (!Number.isFinite(distance) || distance < 1e-6 || max <= 0) return { x: 0, y: 0 }
  const k = max * Math.min(1, distance / Math.max(1e-6, reach)) / distance
  return { x: dx * k, y: dy * k }
}
export const timeline = (letters: number, crew: number, words: number, actions: number) => {
  const L = Math.max(0, Math.floor(letters) || 0), C = Math.max(0, Math.floor(crew) || 0)
  const W = Math.max(0, Math.floor(words) || 0), A = Math.max(0, Math.floor(actions) || 0)
  const letter = (i: number) => 160 + i * 80
  const crewStart = letter(Math.max(0, L - 1)) + 420
  const member = (i: number) => crewStart + i * 130
  const doodles = crewStart + Math.max(0, C - 1) * 65
  const word = (i: number) => crewStart + 260 + i * 45
  const action = (i: number) => word(W) + 120 + i * 110
  return { ground: 60, letter, crewStart, member, doodles, word, action, total: Math.max(member(C - 1) + 720, action(A - 1) + 600, letter(L - 1) + 560) }
}

export type CrewKind = "yeti" | "kid" | "bird" | "cat" | "ghost" | "mushroom"
export type DoodleKind = "flame" | "sandwich" | "star" | "heart" | "bolt" | "sparkle" | "spiral" | "plane"
export type DoodleCrewPreset = "auto" | "paper" | "night" | "riso" | "sunny"
export interface CrewMember { kind: CrewKind; letter: number; seat?: Seat; offset?: number; scale?: number; flip?: boolean; name?: string; says?: string }
export interface FooterLink { label: string; href?: string }
export interface FooterColumn { title: string; links: FooterLink[] }
export interface FooterAction { label: string; href?: string; icon?: DoodleKind; variant?: "solid" | "outline"; onClick?: () => void }
export interface DoodleCrewFooterProps {
  wordmark?: string; brand?: string; blurb?: string; tagline?: string; columns?: FooterColumn[]; actions?: FooterAction[]
  copyright?: string; legal?: FooterLink[]; socials?: FooterLink[]; backToTop?: boolean; crew?: CrewMember[]
  doodles?: DoodleKind[]; doodleCount?: number; preset?: DoodleCrewPreset
  palette?: { background?: string; ink?: string; accent?: string }; fontFamily?: string; serifFamily?: string
  tracking?: number; interactive?: boolean; height?: string; className?: string
}

const PRESETS: Record<DoodleCrewPreset, { background: string; ink: string; accent: string }> = {
  auto: { background: "var(--color-background, #ffffff)", ink: "var(--color-foreground, #0d0d0d)", accent: "#ff6b2c" },
  paper: { background: "#ffffff", ink: "#0d0d0d", accent: "#ff6b2c" },
  night: { background: "#0e0e10", ink: "#f4f1ea", accent: "#ff8a3d" },
  riso: { background: "#f4f2ff", ink: "#2433c9", accent: "#ff4f8b" },
  sunny: { background: "#ffd94a", ink: "#141414", accent: "#e8402a" },
}
const DEFAULT_CREW: CrewMember[] = [
  { kind: "yeti", letter: 0, seat: "front", offset: -.32, name: "Bruno", says: "Hungry. Got snacks?" },
  { kind: "bird", letter: 1, seat: "top", name: "Pip", says: "Tweet us!" },
  { kind: "mushroom", letter: 2, seat: "front", name: "Morel", says: "I'm a fun guy." },
  { kind: "kid", letter: 4, seat: "top", name: "Juno", says: "Best seat in the house." },
  { kind: "ghost", letter: 6, seat: "behind", name: "Boo", says: "Boo! …sorry. Hi." },
  { kind: "cat", letter: 7, seat: "front", name: "Patch", says: "Nice cursor." },
]
const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Explore", links: [{ label: "About", href: "#about" }, { label: "Experience", href: "#experience" }, { label: "Projects", href: "#projects" }] },
  { title: "Learning", links: [{ label: "Computer Science", href: "#about" }, { label: "Cybersecurity", href: "#experience" }, { label: "Veterinary Medicine", href: "#about" }] },
  { title: "Connect", links: [{ label: "Email", href: "mailto:khobiziibtessam@gmail.com" }, { label: "LinkedIn", href: "https://www.linkedin.com/in/khobizi-ibtessam-482781307" }] },
]
const DEFAULT_ACTIONS: FooterAction[] = [{ label: "Explore my work", href: "#projects", icon: "star", variant: "outline" }, { label: "Get in touch", href: "#contact", icon: "sparkle", variant: "solid" }]
const DEFAULT_DOODLES: DoodleKind[] = ["flame", "sandwich", "star", "heart", "bolt", "sparkle", "spiral", "plane"]
const INK = { flame: "#ff7a1a", gold: "#ffd23f", heart: "#ff5c7a", bread: "#f2c48d", leaf: "#5fb247", sky: "#8fdcff" }

function Doodle({ kind }: { kind: DoodleKind }) {
  switch (kind) {
    case "flame": return <><path fill={INK.flame} d="M0 14C-9 14-12 6-10 0c2-5 6-6 6-12 5 3 7 7 6 11 2-2 3-5 3-7 5 5 6 12 3 17-2 3-5 5-8 5Z"/><path fill={INK.gold} d="M0 11c-4 0-6-4-5-7 1-3 4-4 4-8 3 3 5 7 3 10 2-2 3-3 3-4 2 5 0 9-5 9Z"/></>
    case "sandwich": return <><path fill={INK.bread} d="M-13 5h26l-.5 4.5c-8 2-18 2-25 0Z"/><path fill={INK.leaf} d="M-12 2q3 3 6 0t6 0t6 0t6 0" stroke="currentColor" strokeWidth="2"/><path fill={INK.bread} d="M-13-1c-1-7 3-10 7-9 4-4 9-4 12 0 4-1 8 2 7 9Z"/></>
    case "star": return <path fill={INK.gold} d="m0-13 4 8 9 1-7 6 2 10-8-5-8 5 2-10-7-6 9-1Z"/>
    case "heart": return <path fill={INK.heart} d="M0 11C-6 6-13 1-13-5c0-5 5-8 9-6l4 5 4-5c4-2 9 1 9 6 0 6-7 11-13 16Z"/>
    case "bolt": return <path fill={INK.gold} d="m3-14-11 16h7l-3 12L8-3H1Z"/>
    case "sparkle": return <path fill={INK.sky} d="M0-13c1 9 4 12 13 13C4 1 1 4 0 13-1 4-4 1-13 0-4-1-1-4 0-13Z"/>
    case "spiral": return <path fill="none" d="M0 0c2-2 4 0 3 3-2 3-7 2-8-2-1-5 4-9 9-8 5 2 6 9 3 13"/>
    case "plane": return <path fill="var(--dcf-bg)" d="m-13-1 26-9L4 12 0 3Z"/>
  }
  return null
}
const Icon = ({ kind, size = 18 }: { kind: DoodleKind; size?: number }) => <svg className="dcf-icon" viewBox="-16 -16 32 32" width={size} height={size} aria-hidden="true"><Doodle kind={kind}/></svg>

const CSS = `
.dcf{position:relative;isolation:isolate;overflow:hidden;overflow:clip;width:100%;box-sizing:border-box;display:flex;flex-direction:column;background:var(--dcf-bg);color:var(--dcf-ink);font-family:ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased;--dcf-soft:color-mix(in oklab,var(--dcf-ink) 62%,var(--dcf-bg));--dcf-line:color-mix(in oklab,var(--dcf-ink) 14%,var(--dcf-bg));--dcf-pad:clamp(16px,4vw,56px)}
.dcf *,.dcf *:before,.dcf *:after{box-sizing:border-box}.dcf a{color:inherit;text-decoration:none}.dcf button{font:inherit;color:inherit;cursor:pointer}.dcf h2,.dcf h3,.dcf p,.dcf ul{margin:0;padding:0}.dcf ul{list-style:none}.dcf svg{max-width:none;overflow:visible}.dcf :focus-visible{outline:2px dashed var(--dcf-ink);outline-offset:4px;border-radius:6px}.dcf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
.dcf-top{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,2fr);grid-template-rows:auto 1fr;gap:14px clamp(24px,5vw,80px);padding:clamp(28px,4.5vw,56px) var(--dcf-pad) 0;max-width:1360px;width:100%;margin:auto;position:relative;z-index:3}.dcf-brand{display:flex;align-items:center;gap:10px;grid-column:1}.dcf-logo{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:2px solid var(--dcf-ink);background:var(--dcf-bg);transform:rotate(-6deg);transition:transform .35s}.dcf-brand:hover .dcf-logo{transform:rotate(8deg) scale(1.06)}.dcf-brandname{font-weight:800;font-size:19px;letter-spacing:-.02em}.dcf-blurb{grid-column:1;font-family:var(--dcf-serif);font-size:15px;line-height:1.55;color:var(--dcf-soft);max-width:34ch}.dcf-cols{grid-column:2;grid-row:1/span 2;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.dcf-coltitle{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px}.dcf-col li{margin-bottom:7px}.dcf-link{position:relative;display:inline-block;font-size:14px;color:var(--dcf-soft);padding:2px 0}.dcf-link:hover{color:var(--dcf-ink)}.dcf-squiggle{position:absolute;left:-2px;bottom:-4px;width:calc(100% + 4px);height:7px}.dcf-squiggle path{fill:none;stroke:var(--dcf-accent);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .35s}.dcf-link:hover .dcf-squiggle path{stroke-dashoffset:0}
.dcf-world{position:relative;flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(22px,4vw,48px) var(--dcf-pad) 0;max-width:1360px;width:100%;margin:auto}.dcf-stage{position:relative;z-index:1}.dcf-svg{display:block;width:100%;height:auto;user-select:none}.dcf-svg text{fill:var(--dcf-ink)}.dcf-art{fill:var(--dcf-bg);stroke:var(--dcf-ink);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.dcf-art .n{fill:none}.dcf-art .k{fill:var(--dcf-ink)}.dcf-art .a{fill:var(--dcf-accent)}.dcf-art .r{fill:#ff4d4d}.dcf-art .dcf-shadow{fill:var(--dcf-ink);stroke:none;opacity:.14}.dcf-ground path{fill:none;stroke:var(--dcf-ink);stroke-width:2.4;stroke-linecap:round}.dcf-ground .dcf-tufts{stroke-width:1.8}.dcf-pebble{fill:var(--dcf-bg);stroke:var(--dcf-ink);stroke-width:1.6}.dcf-hit{fill:transparent;stroke:none;cursor:pointer}.dcf-glyph{transform-box:fill-box;transform-origin:50% 100%}.dcf[data-interactive="1"] .dcf-glyph:hover{animation:dcf-jiggle .6s}.dcf-art.dcf-bob{animation:dcf-bob 3.2s ease-in-out infinite}.dcf-art.dcf-sway{transform-box:fill-box;transform-origin:50% 100%;animation:dcf-swing 4s ease-in-out infinite}.dcf-hopper{transform-box:fill-box;transform-origin:50% 100%}.dcf-hopper.is-hop{animation:dcf-hop .62s}.dcf-arrive{transform-box:fill-box;transform-origin:50% 100%}.dcf-bubbles{position:absolute;inset:0;pointer-events:none;z-index:2}.dcf-bubble{position:absolute;transform:translate(-50%,-100%);background:var(--dcf-bg);color:var(--dcf-ink);border:2px solid var(--dcf-ink);border-radius:16px;padding:7px 12px;font-size:13px;font-weight:700;white-space:nowrap;box-shadow:3px 3px var(--dcf-ink);animation:dcf-popin .25s both}
.dcf-doodles{position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden}.dcf-doodle{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;will-change:transform}.dcf-doodle svg,.dcf-icon{display:block;stroke:var(--dcf-ink);stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round}.dcf-doodle svg{width:100%;height:100%;filter:drop-shadow(2px 2px 0 color-mix(in oklab,var(--dcf-ink) 18%,transparent))}.dcf-cta{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;gap:20px;padding:clamp(20px,3vw,34px) 0 clamp(30px,4vw,48px);text-align:center}.dcf-tagline{font-family:var(--dcf-serif);font-size:clamp(17px,1.9vw,22px);line-height:1.4}.dcf-word{display:inline-block;white-space:pre}.dcf-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}.dcf-btn{display:inline-flex;align-items:center;gap:8px;height:46px;padding:0 20px 0 16px;border-radius:999px;border:2px solid var(--dcf-ink);font-size:14px;font-weight:750;box-shadow:0 3px var(--dcf-ink);transition:transform .18s}.dcf-btn.is-outline{background:var(--dcf-bg);color:var(--dcf-ink)}.dcf-btn.is-solid{background:var(--dcf-ink);color:var(--dcf-bg)}.dcf-btn:hover{transform:translateY(-2px) rotate(-1deg)}.dcf-bar{position:relative;z-index:3;display:flex;flex-wrap:wrap;align-items:center;gap:10px 26px;padding:18px var(--dcf-pad) 22px;max-width:1360px;width:100%;margin:auto;border-top:1.5px dashed var(--dcf-line);font-size:13px}.dcf-copy{color:var(--dcf-soft);margin-right:auto}.dcf-inline{display:flex;flex-wrap:wrap;gap:4px 18px}.dcf-totop{display:inline-flex;align-items:center;gap:6px;font-weight:700;padding:6px 12px;border-radius:999px;border:1.5px solid var(--dcf-ink)}.dcf-totop svg{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}.dcf-rise,.dcf-letter,.dcf-arrive,.dcf-word,.dcf-pop,.dcf-fade,.dcf-doodle-in{opacity:0}.dcf[data-play="1"] .dcf-letter{animation:dcf-stamp .62s cubic-bezier(.2,.8,.25,1.15) var(--d) both}.dcf[data-play="1"] .dcf-draw{stroke-dasharray:1;animation:dcf-draw 1.1s var(--d) both}.dcf[data-play="1"] .dcf-fade{animation:dcf-fade .6s var(--d) both}.dcf[data-play="1"] .dcf-arrive-front{animation:dcf-rise-up .75s var(--d) both}.dcf[data-play="1"] .dcf-arrive-top{animation:dcf-plop .8s var(--d) both}.dcf[data-play="1"] .dcf-arrive-behind{animation:dcf-peek .9s var(--d) both}.dcf[data-play="1"] .dcf-word{animation:dcf-popin .5s var(--d) both}.dcf[data-play="1"] .dcf-pop{animation:dcf-popin .55s var(--d) both}.dcf[data-play="1"] .dcf-rise{animation:dcf-fadeup .7s var(--d) both}.dcf[data-play="1"] .dcf-doodle-in{animation:dcf-fade .6s var(--d) both}
@keyframes dcf-stamp{0%{opacity:0;transform:translateY(-34%) scale(1.2) rotate(var(--r))}60%{opacity:1;transform:translateY(2%) scale(.96,1.04)}100%{opacity:1;transform:none}}@keyframes dcf-draw{to{stroke-dashoffset:0}}@keyframes dcf-fade{to{opacity:1}}@keyframes dcf-rise-up{0%{opacity:0;transform:translateY(30%) scale(.7,.3)}55%{opacity:1;transform:translateY(-6%) scale(.95,1.08)}100%{opacity:1;transform:none}}@keyframes dcf-plop{0%{opacity:0;transform:translateY(-80%)}55%{opacity:1;transform:translateY(0) scale(1.1,.86)}100%{opacity:1;transform:none}}@keyframes dcf-peek{0%{opacity:0;transform:translateY(55%)}60%{opacity:1;transform:translateY(-6%)}100%{opacity:1;transform:none}}@keyframes dcf-popin{from{opacity:0;transform:translateY(8px) scale(.7)}to{opacity:1;transform:none}}@keyframes dcf-fadeup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes dcf-jiggle{25%{transform:rotate(-4deg) scale(1.03)}60%{transform:rotate(3deg) translateY(-3%)}to{transform:none}}@keyframes dcf-hop{18%{transform:scale(1.1,.85)}48%{transform:translateY(-28%) scale(.94,1.08)}78%{transform:translateY(0) scale(1.08,.9)}to{transform:none}}@keyframes dcf-bob{50%{transform:translateY(-5px)}}@keyframes dcf-swing{50%{transform:rotate(2.5deg)}}
@media(max-width:860px){.dcf-top{grid-template-columns:1fr;grid-template-rows:auto}.dcf-brand,.dcf-blurb,.dcf-cols{grid-column:1;grid-row:auto}.dcf-cols{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:14px}.dcf-copy{width:100%;margin-right:0}}@media(max-width:480px){.dcf-btn{height:42px;font-size:13px;padding-inline:14px}.dcf-totop span{display:none}}@media(prefers-reduced-motion:reduce){.dcf *,.dcf *:before,.dcf *:after{animation:none!important;transition:none!important}.dcf .dcf-letter,.dcf .dcf-arrive,.dcf .dcf-word,.dcf .dcf-pop,.dcf .dcf-rise,.dcf .dcf-fade,.dcf .dcf-doodle-in{opacity:1!important}.dcf .dcf-draw{stroke-dashoffset:0!important}}
`

const Link = ({ link, className }: { link: FooterLink; className?: string }) => link.href ? (
  <a className={className} href={link.href}>
    <span>{link.label}</span><svg className="dcf-squiggle" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true"><path pathLength={1} d="M1 5C10 1 16 7 25 4S40 1 50 4s16 3 25 0 15-3 24 0"/></svg>
  </a>
) : <span className={className}>{link.label}</span>

export function DoodleCrewFooter({
  wordmark = "IBTVERSE", brand = "ibtVerse", blurb = "A multidisciplinary journey through computer science, veterinary medicine and cybersecurity.",
  tagline = "Curiosity connects every part of my journey.", columns = DEFAULT_COLUMNS, actions = DEFAULT_ACTIONS,
  copyright = "© 2026 ibtVerse — the digital universe of Ibtessam", legal = [], socials = DEFAULT_COLUMNS[2].links,
  backToTop = true, crew = DEFAULT_CREW, doodles = DEFAULT_DOODLES, doodleCount = 12, preset = "auto", palette,
  fontFamily = '"Arial Black", Inter, "Helvetica Neue", Arial, sans-serif', serifFamily = 'Georgia, "Times New Roman", serif',
  tracking = -.02, interactive = true, height = "min(760px, 100vh)", className,
}: DoodleCrewFooterProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const word = wordmark.toUpperCase(), chars = React.useMemo(() => Array.from(word), [word])
  const colors = { ...PRESETS[preset], ...palette }
  const rootRef = React.useRef<HTMLElement | null>(null), worldRef = React.useRef<HTMLDivElement | null>(null)
  const [play, setPlay] = React.useState(false), [talking, setTalking] = React.useState(-1), [hopping, setHopping] = React.useState(-1)
  const [sizes, setSizes] = React.useState({ width: 1000, height: 280 })
  const [pointer, setPointer] = React.useState({ x: -1000, y: -1000 })
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const fontSize = 200
  const advances = React.useMemo(() => chars.map(ch => ch === " " ? 60 : /[IJ1]/.test(ch) ? 84 : /[MW]/.test(ch) ? 196 : 152), [chars])
  const layout = React.useMemo(() => layoutWord(advances, tracking, fontSize), [advances, tracking])
  const cap = 146
  const placed = React.useMemo(() => crew.map((member, i) => {
    const art = member.kind
    const li = clamp(Math.floor(member.letter) || 0, 0, Math.max(0, chars.length - 1))
    const scale = (cap / 144) * (member.scale ?? 1)
    const seat = member.seat || (art === "bird" || art === "kid" ? "top" : art === "ghost" ? "behind" : "front")
    const point = seatPoint(seat, layout.x[li] ?? 0, layout.w[li] ?? 0, cap, member.offset ?? 0, scale)
    return { ...member, i, seat, scale, ...point }
  }), [crew, chars.length, layout])
  const words = tagline.split(/\s+/).filter(Boolean)
  const timings = timeline(chars.length, placed.length, words.length, actions.length)
  const doodleItems = React.useMemo(() => {
    const count = doodles.length ? clamp(Math.floor(doodleCount) || 0, 0, 40) : 0
    return Array.from({ length: count }, (_, i) => ({ kind: doodles.length ? doodles[i % doodles.length] : "star" as DoodleKind, seed: i, size: 22 + hash(i * 4.7) * 14 }))
  }, [doodles, doodleCount])

  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") { setPlay(true); return }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && entry.intersectionRatio > .12) setPlay(true) }, { threshold: [0, .12, .3] })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  React.useEffect(() => {
    const el = worldRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(([entry]) => setSizes({ width: entry.contentRect.width, height: entry.contentRect.height }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const view = React.useMemo(() => {
    const width = Math.max(layout.width + 50, 640), scale = width / Math.max(1, layout.width + 50)
    return { x: -25, y: -cap - 120, width, height: Math.max(330, cap + 190) , scale }
  }, [layout.width])
  const talk = (index: number) => {
    if (!interactive) return
    setTalking(index); setHopping(-1); requestAnimationFrame(() => setHopping(index))
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => { setTalking(-1); setHopping(-1) }, 2400)
  }
  const vars = {
    "--dcf-bg": colors.background, "--dcf-ink": colors.ink, "--dcf-accent": colors.accent,
    "--dcf-serif": serifFamily, "--dcf-display": fontFamily, minHeight: height,
  } as React.CSSProperties
  const pointPct = (v: number, total: number) => `${(v / Math.max(1, total)) * 100}%`

  return <footer ref={rootRef} className={`dcf${className ? ` ${className}` : ""}`} data-play={play ? "1" : "0"} data-interactive={interactive ? "1" : "0"} style={vars}
    onPointerMove={e => { const r = worldRef.current?.getBoundingClientRect(); if (r) setPointer({ x: e.clientX - r.left, y: e.clientY - r.top }) }} onPointerLeave={() => setPointer({ x: -1000, y: -1000 })}>
    <style>{CSS}</style>
    <div className="dcf-top dcf-rise" style={{ "--d": "0ms" } as React.CSSProperties}>
      <div className="dcf-brand"><span className="dcf-logo" aria-hidden="true"><svg viewBox="-40 -80 80 80" width="30" height="30"><path className="dcf-art" d="M-24-12v-35c0-14 10-23 24-23s24 9 24 23v35M-20-22h40"/><circle className="dcf-art k" cx="-9" cy="-43" r="3"/><circle className="dcf-art k" cx="9" cy="-43" r="3"/></svg></span><span className="dcf-brandname">{brand}</span></div>
      {blurb && <p className="dcf-blurb">{blurb}</p>}
      {columns.length > 0 && <nav className="dcf-cols" aria-label="Footer links">{columns.map(column => <div className="dcf-col" key={column.title}><h3 className="dcf-coltitle">{column.title}</h3><ul>{column.links.map(link => <li key={link.label}><Link link={link} className="dcf-link"/></li>)}</ul></div>)}</nav>}
    </div>
    <div className="dcf-world" ref={worldRef}>
      <div className="dcf-doodles" aria-hidden="true">{doodleItems.map((item, i) => {
        const x = (hash(i * 4.7) * .92 + .04) * sizes.width
        const baseY = hash(i * 3.3) * sizes.height * .65 + 12
        const away = Math.hypot(pointer.x - x, pointer.y - baseY) < 120
        return <div key={i} className="dcf-doodle dcf-doodle-in" style={{ width: item.size, height: item.size, marginLeft: -item.size / 2, marginTop: -item.size / 2, left: x, top: away ? baseY - 35 : baseY, transform: `rotate(${(hash(i * 8.3) - .5) * 32}deg)`, "--d": `${timings.doodles + i * 70}ms` } as React.CSSProperties} onPointerDown={event => { if (!interactive) return; event.currentTarget.animate([{ scale: 1 }, { scale: 1.5, opacity: 0 }, { scale: 0 }], { duration: 300 }) }}><Doodle kind={item.kind}/></div>
      })}</div>
      <div className="dcf-stage"><h2 className="dcf-sr">{wordmark}</h2>
        <svg className="dcf-svg" viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`} role="group" aria-label={`${wordmark} — meet the crew`}>
          <defs><pattern id={`${uid}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="5" stroke="var(--dcf-ink)" strokeWidth="1.2"/></pattern><filter id={`${uid}-ink`} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter></defs>
          <g className="dcf-ground"><path className="dcf-draw" pathLength="1" d={`M${view.x} 8 Q${view.width / 2} 2 ${view.width + view.x} 8`} style={{ "--d": `${timings.ground}ms` } as React.CSSProperties}/><path className="dcf-tufts dcf-fade" d={`M20 8l3-8m4 8 2-10m${view.width - 55} 10 3-9m5 9 2-7`} style={{ "--d": `${timings.ground + 400}ms` } as React.CSSProperties}/></g>
          {placed.filter(p => p.seat === "behind").map(p => <CrewFigure key={`back-${p.i}`} member={p} hopping={hopping === p.i} onClick={() => talk(p.i)} style={{ transform: `translate(${p.x}px,${p.y}px) scale(${p.scale})`, "--d": `${timings.member(p.i)}ms` } as React.CSSProperties}/>)}
          {chars.map((char, i) => char === " " ? null : <g key={i} className="dcf-letter" style={{ "--d": `${timings.letter(i)}ms`, "--r": `${(hash(i * 2.3) - .5) * 9}deg` } as React.CSSProperties}><text className="dcf-glyph" x={layout.x[i]} y="0" fontSize={fontSize} fontWeight="900" fontFamily={fontFamily} filter={`url(#${uid}-ink)`}>{char}</text><path className="dcf-dust" d={`M${layout.x[i]} -6l-12 -10m${layout.w[i]} 8 12-10`}/></g>)}
          {placed.filter(p => p.seat !== "behind").map(p => <CrewFigure key={`front-${p.i}`} member={p} hopping={hopping === p.i} onClick={() => talk(p.i)} style={{ transform: `translate(${p.x}px,${p.y}px) scale(${p.scale})`, "--d": `${timings.member(p.i)}ms` } as React.CSSProperties}/>)}
          {placed.map(p => <rect key={`hit-${p.i}`} className="dcf-hit" x={p.x - 42 * p.scale} y={p.y - 125 * p.scale} width={84 * p.scale} height={132 * p.scale} rx="12" role="button" tabIndex={interactive ? 0 : -1} aria-label={`${p.name || p.kind}${p.says ? `: ${p.says}` : ""}`} onClick={() => talk(p.i)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); talk(p.i) } }}/>) }
        </svg>
        {placed.map(p => talking === p.i && p.says && <div key={`say-${p.i}`} className="dcf-bubble" style={{ left: pointPct(p.x, view.width), top: pointPct(Math.max(20, view.height * .22), view.height) }}>{p.says}</div>)}
      </div>
      <div className="dcf-cta"><p className="dcf-tagline">{words.map((word, i) => <span key={i} className="dcf-word" style={{ "--d": `${timings.word(i)}ms` } as React.CSSProperties}>{word} </span>)}</p>
        {actions.length > 0 && <div className="dcf-actions">{actions.map((action, i) => { const content = <>{action.icon && <Icon kind={action.icon}/>}<span>{action.label}</span></>; const cls = `dcf-btn dcf-pop ${action.variant === "outline" ? "is-outline" : "is-solid"}`; const actionStyle = { "--d": `${timings.action(i)}ms` } as React.CSSProperties; return action.href ? <a key={action.label} href={action.href} className={cls} style={actionStyle} onClick={action.onClick}>{content}</a> : <button key={action.label} type="button" className={cls} style={actionStyle} onClick={action.onClick}>{content}</button> })}</div>}
      </div>
    </div>
    <div className="dcf-bar dcf-rise" style={{ "--d": "120ms" } as React.CSSProperties}><p className="dcf-copy">{copyright}</p>{legal.length > 0 && <ul className="dcf-inline">{legal.map(link => <li key={link.label}><Link link={link} className="dcf-link"/></li>)}</ul>}{socials.length > 0 && <ul className="dcf-inline dcf-socials">{socials.map(link => <li key={link.label}><Link link={link} className="dcf-link"/></li>)}</ul>}{backToTop && <button className="dcf-totop" type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}><span>Back to top</span><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 20V4M5 11l7-7 7 7"/></svg></button>}</div>
  </footer>
}

function CrewFigure({ member, hopping, onClick, style }: { member: CrewMember & { i: number; seat: Seat; scale: number; x: number; y: number }; hopping: boolean; onClick: () => void; style: React.CSSProperties }) {
  const kid = member.kind === "kid", bird = member.kind === "bird", ghost = member.kind === "ghost", mushroom = member.kind === "mushroom", cat = member.kind === "cat"
  return <g style={style} className={`dcf-arrive dcf-arrive-${member.seat}`} onClick={onClick}>
    <g className={`dcf-hopper${hopping ? " is-hop" : ""}`}>
      {bird ? <g className="dcf-art dcf-sway"><ellipse cx="0" cy="-20" rx="22" ry="20"/><path className="a" d="m18-25 17 5-17 5Z"/><circle className="k" cx="5" cy="-24" r="3"/><path d="M-7-38l4-14 9 13Z"/></g>
        : mushroom ? <g className="dcf-art dcf-sway"><path d="M-10 0q-5-16-1-25h22q4 9 0 25Z"/><path className="r" d="M-26-26q1-27 26-27t26 27q-24 9-52 0Z"/><circle cx="-10" cy="-37" r="4"/><circle cx="9" cy="-42" r="3"/><circle className="k" cx="-4" cy="-16" r="2"/><circle className="k" cx="5" cy="-16" r="2"/></g>
        : kid ? <g className="dcf-art"><path d="M-16 0l-5 22h10l6-19m9-1 8 22h10L13-1Z"/><path className="a" d="M-17-3h34l-5-26h-24Z"/><circle cx="0" cy="-42" r="15"/><path d="M-19-48q20-27 39 0Z"/><circle className="k" cx="-5" cy="-43" r="2.5"/><circle className="k" cx="5" cy="-43" r="2.5"/><path className="n" d="M-4-35q4 4 8 0"/></g>
        : ghost ? <g className="dcf-art dcf-bob"><path d="M-22 0v-30q0-35 22-35t22 35V0l-11-8L0 0l-11-8Z"/><circle className="k" cx="-8" cy="-39" r="3"/><circle className="k" cx="8" cy="-39" r="3"/><ellipse cx="0" cy="-25" rx="4" ry="6"/></g>
        : cat ? <g className="dcf-art"><path d="M-20 0v-28q0-28 20-28t20 28v28M-18-43l-4-20 17 12m27 8 4-20-17 12"/><ellipse className="a" cx="0" cy="-28" rx="15" ry="9"/><circle className="k" cx="-7" cy="-40" r="2.5"/><circle className="k" cx="7" cy="-40" r="2.5"/><path className="n" d="M-3-31l3 3 3-3m-3 3v4"/></g>
        : <g className="dcf-art"><ellipse className="dcf-shadow" cx="0" cy="0" rx="34" ry="4"/><path d="M-30 0q-10-44 0-70 10-26 30-26t30 26q10 26 0 70q-30 7-60 0Z"/><path d="M-26-70l-4-25 24 17m32 8 4-25-24 17"/><circle className="k" cx="-12" cy="-58" r="4"/><circle className="k" cx="12" cy="-58" r="4"/><path className="n" d="M-8-40q8 8 16 0"/><path className="a" d="M-4-36l4 5 4-5Z"/></g>}
    </g>
  </g>
}

export { DoodleCrewFooter as Component }
