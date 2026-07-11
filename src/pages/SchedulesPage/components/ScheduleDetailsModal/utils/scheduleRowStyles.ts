/** Solid equivalents of row backgrounds over bg-bg-surface (#fff). */
const COMPLETE_ROW_BG = 'bg-[#e7f8f2]' // emerald-500/10
const COMPLETE_ROW_HOVER = 'hover:bg-[#dbf5ec]' // emerald-500/15
const STRIPE_ROW_BG = 'bg-[#fbfcfc]' // bg-muted/30
const STRIPE_ROW_HOVER = 'hover:bg-[#f9fafb]' // bg-muted/10
const EVEN_ROW_BG = 'bg-bg-surface'

export function getRowCellBackgroundClass(index: number, isComplete: boolean) {
  if (isComplete) return COMPLETE_ROW_BG

  return index % 2 === 0 ? EVEN_ROW_BG : STRIPE_ROW_BG
}

export function getRowCellHoverClass(isComplete: boolean) {
  return isComplete ? COMPLETE_ROW_HOVER : STRIPE_ROW_HOVER
}

/** Sticky cells use the same solid colors — no separate palette. */
export const getStickyCellBackgroundClass = getRowCellBackgroundClass
export const getStickyCellHoverClass = getRowCellHoverClass

export const SCHEDULE_FOOTER_ROW_BG = 'bg-[#fdfdfd]' // bg-muted/20
export const SCHEDULE_FOOTER_STICKY_BG = 'bg-[#fdfdfd]'
