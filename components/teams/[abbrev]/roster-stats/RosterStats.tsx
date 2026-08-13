import React from 'react'
import { SkaterStats, GoalieStats } from '@/lib/types'
import SkaterTable from '@/components/players/SkaterTable';
import GoalieTable from '@/components/players/GoalieTable';

function RosterStats({ skaters, goalies}: { skaters: SkaterStats[]; goalies: GoalieStats[]}) {
  return (
    <div>
      <SkaterTable skaters={skaters} title='Skaters' showPositionFilter={false} showRowLimit={false}/>
      <GoalieTable goalies={goalies} initialSort='gamesPlayed' title='Goalies' showRowLimit={false}/>
    </div>
  )
}

export default RosterStats