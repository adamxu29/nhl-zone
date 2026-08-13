'use client'

import StatTable from '@/components/stats/StatTable'
import PlayerCell from '@/components/stats/PlayerCell'
import { GoalieStats, StatColumn } from '@/lib/types'
import { formatGAA, formatSavePct } from '@/lib/format'

const gridCols =
  'grid grid-cols-[2fr_0.5fr_0.5fr_0.6fr_0.6fr_0.5fr_0.5fr_0.7fr_0.6fr] md:grid-cols-[2.4fr_0.5fr_0.5fr_0.6fr_0.6fr_0.5fr_0.5fr_0.7fr_0.6fr] items-center gap-x-2 px-3 md:px-4'

const columns: StatColumn<GoalieStats>[] = [
  { label: 'Player', key: 'name', sortable: false, render: (g, i) => <PlayerCell item={g} index={i}/> },
  { label: 'GP', key: 'gamesPlayed' },
  { label: 'GS', key: 'gamesStarted'},
  { label: 'SV %', key: 'savePct', format: formatSavePct },
  { label: 'GAA', key: 'goalsAgainstAverage', asc: true, format: formatGAA },
  { label: 'SO', key: 'shutouts' },
  { label: 'W', key: 'wins' },
  { label: 'L', key: 'losses', asc: true },
  { label: 'OTL', key: 'otLosses' },
]

function GoalieTable({
  goalies,
  initialSort = 'goalsAgainstAverage',
  title = 'Goalie Statistics',
  showRowLimit = true,
}: {
  goalies: GoalieStats[]
  initialSort?: string
  title?: string
  showRowLimit?: boolean
}) {
  return (
    <StatTable
      title={title}
      rows={goalies}
      columns={columns}
      gridCols={gridCols}
      initialSort={initialSort}
      rowLimits={[25, 50, 100]}
      defaultRowLimit={25}
      showRowLimit={showRowLimit}
    />
  )
}

export default GoalieTable
