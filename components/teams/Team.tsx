import Link from 'next/link'
import React from 'react'

function Team({ id, name, abbrev }: { id: number; name:string ; abbrev: string }) {
  return (
    <div className='flex border-b border-b-[#e0e0e0] py-3'>
      <img className='w-[72px] h-[48px] mr-5' src={`https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`} alt='team_logo'/>
      <div>
        <Link href={`/teams/${abbrev}`}>
          <p className='text-lg font-bold'>{name}</p>
        </Link>
        <div className='flex text-sm text-[#374151]'>
          <Link href={`/teams/${abbrev}#roster`}>
            Roster
          </Link>
          <p className='mx-2'>{"\u2022"}</p>
          <Link href={'/'}>
            Schedule
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Team