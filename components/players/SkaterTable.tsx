'use client'

import StatTable from '@/components/stats/StatTable'
import PlayerCell from '@/components/stats/PlayerCell'
import { SkaterStats, StatColumn } from '@/lib/types'
import { formatTOI } from '@/lib/format'

const gridCols =
  'grid grid-cols-[2fr_0.5fr_0.5fr_0.5fr_0.6fr_0.5fr_0.5fr_0.7fr_0.6fr] md:grid-cols-[2.4fr_0.5fr_0.5fr_0.5fr_0.6fr_0.5fr_0.5fr_0.7fr_0.6fr] items-center gap-x-2 px-3 md:px-4'

const columns: StatColumn<SkaterStats>[] = [
  { label: 'Player', key: 'name', sortable: false, render: (p, i) => <PlayerCell item={p} index={i}/> },
  // the API stores wingers as plain L / R
  { label: 'Pos', key: 'positionCode', sortable: false,
    render: (p) => <>{p.positionCode}{(p.positionCode === 'L' || p.positionCode === 'R') && 'W'}</> },
  { label: 'GP', key: 'gamesPlayed', sortable: false },
  { label: 'G', key: 'goals' },
  { label: 'A', key: 'assists' },
  { label: 'Pts', key: 'points' },
  { label: '+/-', key: 'plusMinus' },
  { label: 'TOI', key: 'timeOnIcePerGame', format: formatTOI },
  { label: 'PIM', key: 'penaltyMinutes' },
]

const positionFilter = {
  defaultValue: 'ALL',
  options: [
    { label: 'All Positions', value: 'ALL' },
    { label: 'Forwards', value: 'F' },
    { label: 'Defense', value: 'D' },
  ],
  predicate: (s: SkaterStats, v: string) =>
    v === 'ALL' || (v === 'F' ? ['C', 'L', 'R'].includes(s.positionCode) : s.positionCode === v),
}

function SkaterTable({
  skaters,
  initialSort = 'points',
  title = 'Skater Statistics',
  showPositionFilter = true,
  showRowLimit = true,
}: {
  skaters: SkaterStats[]
  initialSort?: string
  title?: string
  showPositionFilter?: boolean
  showRowLimit?: boolean
}) {
  return (
    <StatTable
      title={title}
      rows={skaters}
      columns={columns}
      gridCols={gridCols}
      initialSort={initialSort}
      showRowLimit={showRowLimit}
      filter={showPositionFilter ? positionFilter : undefined}
    />
  )
}

export default SkaterTable
