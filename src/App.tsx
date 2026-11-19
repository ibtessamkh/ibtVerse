import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navbar } from './components/Navbar'
import { InteractiveHero } from './components/InteractiveHero'
import { Sections } from './components/Sections'
import { Footer } from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
        gsap.fromTo(element, { y: 28, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: .78, ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>('.skill-meter i').forEach((meter, index) => gsap.fromTo(meter, { scaleX: 0 }, {
        scaleX: 1, duration: .9, delay: index * .12, transformOrigin: 'left center', ease: 'power2.out',
        scrollTrigger: { trigger: meter, start: 'top 90%', once: true },
      }))
    })
    return () => context.revert()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return
    const buttons = [...document.querySelectorAll<HTMLElement>('.magnetic')]
    const move = (event: PointerEvent) => {
      const button = event.currentTarget as HTMLElement
      const bounds = button.getBoundingClientRect()
      const x = (event.clientX - bounds.left - bounds.width / 2) * .08
      const y = (event.clientY - bounds.top - bounds.height / 2) * .08
      button.style.setProperty('--magnet-x', `${x.toFixed(1)}px`)
      button.style.setProperty('--magnet-y', `${y.toFixed(1)}px`)
    }
    const reset = (event: PointerEvent) => {
      const button = event.currentTarget as HTMLElement
      button.style.setProperty('--magnet-x', '0px')
      button.style.setProperty('--magnet-y', '0px')
    }
    buttons.forEach(button => { button.addEventListener('pointermove', move); button.addEventListener('pointerleave', reset) })
    return () => buttons.forEach(button => { button.removeEventListener('pointermove', move); button.removeEventListener('pointerleave', reset) })
  }, [])

  return <><Navbar/><main><InteractiveHero/><Sections/></main><Footer/></>
}
