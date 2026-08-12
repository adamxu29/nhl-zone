import React from 'react'
import Division from './Division'
import { TeamData } from '@/lib/types';

function Conference({ name, divisions }: { name: string; divisions: Record<string, TeamData[]>}) {
  return (
    <div>
      <h2 className='text-2xl font-bold mt-6 mb-3'>{name} Conference</h2>
      <div className='grid grid-cols-2 gap-16'>
        {Object.entries(divisions).map(([divName, teamsList]) => (
        <Division key={divName} name={divName} teams={teamsList}/>
      ))}
      </div>
    </div>
  )
}

export default Conference