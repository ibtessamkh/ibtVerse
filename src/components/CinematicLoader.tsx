import { useEffect, useRef, useState } from 'react'
import { siteContent } from '../content'
import { allFrameNumbers, preloadHeroFrames } from '../heroFrames'
import { MapleMark } from './MapleMark'

export function CinematicLoader() {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [progress, setProgress] = useState(0)
  const closeRef = useRef<() => void>(() => undefined)

  useEffect(() => {
    let active = true
    let closed = false
    const started = performance.now()
    let finishTimer = 0
    let removeTimer = 0
    const close = () => {
      if (!active || closed) return
      closed = true
      setProgress(100)
      setExiting(true)
      removeTimer = window.setTimeout(() => { if (active) setVisible(false) }, 460)
    }
    closeRef.current = close
    const hardStop = window.setTimeout(close, 1800)
    void preloadHeroFrames(count => {
      if (active && !closed) setProgress(Math.min(99, Math.round((count / allFrameNumbers.length) * 100)))
    }).then(() => {
      const delay = Math.max(0, 720 - (performance.now() - started))
      finishTimer = window.setTimeout(close, delay)
    })
    return () => { active = false; closeRef.current = () => undefined; window.clearTimeout(hardStop); window.clearTimeout(finishTimer); window.clearTimeout(removeTimer) }
  }, [])

  if (!visible) return null
  return <div className={`cinematic-loader ${exiting ? 'is-exiting' : ''}`}>
    <span className="sr-only" role="status">{siteContent.labels.loaderLabel}</span>
    <span className="loader-scanline" aria-hidden="true"/>
    <div className="loader-card"><MapleMark/><p>{siteContent.labels.loaderLabel}</p><h1>{siteContent.brand}</h1><span>{siteContent.labels.loaderSub}</span>
      <div className="loader-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={siteContent.hero.loading}><i style={{ width: `${progress}%` }}/></div>
      <div className="loader-meta"><span>{siteContent.hero.loading}</span><strong>{String(progress).padStart(3, '0')}</strong></div>
      <button type="button" onClick={() => closeRef.current()}>{siteContent.labels.loaderSkip}</button>
    </div>
  </div>
}
