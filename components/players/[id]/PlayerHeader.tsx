import React from 'react'
import PlayerNav from './PlayerNav'

function PlayerHeader({ id }: { id: number }) {
  return (
    <div>
        {/* Name, photo, team, basic/career stats? */}
        <PlayerNav id={id}/>
    </div>
  )
}

export default PlayerHeader