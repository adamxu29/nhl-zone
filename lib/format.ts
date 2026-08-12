// Display formatters shared across pages.

/** 823.5 seconds -> "13:44" */
export const formatTOI = (v: number) =>
  `${Math.floor(v / 60)}:${String(Math.round(v % 60)).padStart(2, '0')}`

/** 0.921 -> ".921" (save % convention drops the leading zero) */
export const formatSavePct = (v: number) => v.toFixed(3).replace(/^0/, '')

/** 2.0234 -> "2.02" */
export const formatGAA = (v: number) => v.toFixed(2)

/** 1 -> "1st", 2 -> "2nd", 4 -> "4th", 11 -> "11th" */
export const formatOrdinal = (n: number) => {
  const rem100 = n % 100
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'
  return `${n}${suffix}`
}

/** 70 -> "5' 10\"" */
export const formatHeight = (inches: number) =>
  `${Math.floor(inches / 12)}' ${inches % 12}"`

/** "2026-03-03" -> "Tue, Mar 3, 2026" (UTC so the date never shifts a day) */
export const formatGameDate = (date: string, showYear: boolean) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', ...(showYear === true && {year: 'numeric'}), timeZone: 'UTC',
  })

/** "1996-09-09" -> "Sep 9, 1996" (UTC so the date never shifts a day) */
export const formatBirthDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
