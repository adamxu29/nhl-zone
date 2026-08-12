import React from 'react'
import Team from './Team'
import { TeamData } from '@/lib/types';

function Division({ name, teams }: { name: string; teams: TeamData[] }) {
  return (
    <div>
      <h3 className='text-lg text-[#374151] font-bold border-b border-b-[#e0e0e0] pb-1'>{name} Division</h3>
      <div>
        {teams.map((team) => (
          <Team key={team.abbrev} id={team.id} name={team.name} abbrev={team.abbrev}/>
        ))}
      </div>
    </div>
  )
}

export default Division