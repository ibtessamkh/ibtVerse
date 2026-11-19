export type HeroState = 'idle' | 'lookLeft' | 'lookRight' | 'greeting'

// Replace these frame ranges with the exported sequence ranges when the character animation is ready.
export const heroFrames: Record<HeroState, { start: number; end: number; fps: number; loop: boolean }> = {
  idle: { start: 1, end: 8, fps: 12, loop: true },
  lookLeft: { start: 9, end: 12, fps: 12, loop: false },
  lookRight: { start: 13, end: 16, fps: 12, loop: false },
  greeting: { start: 17, end: 32, fps: 12, loop: false },
}

export const framePath = (number: number) => `${import.meta.env.BASE_URL}frames/frame_${String(number).padStart(4, '0')}.webp`
export const allFrameNumbers = Object.values(heroFrames).flatMap(({ start, end }) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index),
)
