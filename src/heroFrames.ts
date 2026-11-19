export type HeroState = 'idle' | 'lookLeft' | 'lookRight' | 'greeting'

// Replace these frame ranges with the exported sequence ranges when the character animation is ready.
export const heroFrames: Record<HeroState, { start: number; end: number; fps: number; loop: boolean }> = {
  idle: { start: 1, end: 8, fps: 12, loop: true },
  lookLeft: { start: 9, end: 12, fps: 12, loop: false },
  lookRight: { start: 13, end: 16, fps: 12, loop: false },
  greeting: { start: 17, end: 56, fps: 12, loop: false },
}

export const framePath = (number: number) => `${import.meta.env.BASE_URL}frames/frame_${String(number).padStart(4, '0')}.webp`
export const allFrameNumbers = Object.values(heroFrames).flatMap(({ start, end }) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index),
)

export const loadedFrames = new Map<number, HTMLImageElement>()
const pendingFrames = new Map<number, Promise<HTMLImageElement>>()

function loadFrame(number: number): Promise<HTMLImageElement> {
  const cached = loadedFrames.get(number)
  if (cached) return Promise.resolve(cached)
  const pending = pendingFrames.get(number)
  if (pending) return pending
  const image = new Image()
  image.decoding = 'async'
  const ready = new Promise<HTMLImageElement>(resolve => {
    image.onload = () => resolve(image)
    image.onerror = () => resolve(image)
  })
  image.src = framePath(number)
  const settled = ready.then(result => {
    loadedFrames.set(number, result)
    pendingFrames.delete(number)
    return result
  })
  pendingFrames.set(number, settled)
  return settled
}

export async function preloadHeroFrames(onProgress?: (loaded: number) => void): Promise<void> {
  const idle = allFrameNumbers.filter(number => number >= heroFrames.idle.start && number <= heroFrames.idle.end)
  const remaining = allFrameNumbers.filter(number => !idle.includes(number))
  for (const number of [...idle, ...remaining]) {
    await loadFrame(number)
    onProgress?.(loadedFrames.size)
  }
}
