# Hero frame placeholders

These numbered WebP frames are temporary copies of the existing Ibtessam portrait so the preload, canvas renderer, interaction zones, and state timing can be exercised before the character animation is supplied. They do not depict the laptop, headset, looking, waving, or pointing poses.

Replace `frame_0001.webp` through `frame_0056.webp` with equally numbered frames exported from one continuous animation. Update state ranges and frame rates in `src/heroFrames.ts` to match the export. The idle range should loop; left/right reactions should be short; the greeting range should end on the downward-pointing pose. Keep the frame dimensions and aspect ratio consistent.
