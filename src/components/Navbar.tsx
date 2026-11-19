import { useEffect, useState } from 'react'
import { siteContent } from '../content'
import { MapleMark } from './MapleMark'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#top')
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('ibtverse-theme') === 'dark' } catch { return false } })

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try { localStorage.setItem('ibtverse-theme', dark ? 'dark' : 'light') } catch { /* Theme still works for this visit. */ }
  }, [dark])

  useEffect(() => {
    const sections = ['top', ...siteContent.nav.map(item => item.href.slice(1))]
      .map(id => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node))
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(`#${visible.target.id}`)
    }, { rootMargin: '-24% 0px -60% 0px', threshold: [0, .2, .5] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return <header className="site-nav"><nav className="nav-wrap mx-auto flex w-full items-center justify-between" aria-label={siteContent.labels.navAria}>
    <a className="brand" href="#top" aria-label={siteContent.labels.homeAria}><MapleMark/>{siteContent.brand.slice(0, 1)}<span>{siteContent.brand.slice(1)}</span></a>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)} onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}><span className="sr-only">{open ? siteContent.labels.menuClose : siteContent.labels.menuOpen}</span><i/><i/></button>
    <div className={`nav-links ${open ? 'is-open' : ''}`} id="nav-links">
      {siteContent.nav.map(item => <a key={item.href} className={active === item.href ? 'is-active' : ''} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
      <button className="theme-toggle" type="button" aria-label={`Switch to ${dark ? siteContent.labels.themeLight : siteContent.labels.themeDark} theme`} aria-pressed={dark} onClick={() => setDark(!dark)}>{dark ? '☼' : '☾'}<span>{dark ? 'Light' : 'Dark'}</span></button>
    </div>
  </nav></header>
}
