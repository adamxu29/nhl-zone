'use client'
import React from 'react'
import { useState } from 'react'
import { SkaterStats } from '@/lib/types'
import { formatTOI } from '@/lib/format'

const tableCols = 'grid grid-cols-[2.4fr_0.5fr_0.5fr_0.5fr_0.6fr_0.5fr_0.5fr_0.7fr_0.6fr] items-center gap-x-2 px-4'

function Player({ player, index }: { player: SkaterStats; index: number }){
  return(
    <div className={`${tableCols} py-1 border-b border-gray-200 text-sm`}>
      <div className='flex items-center gap-3'>
        <p className='w-2 text-gray-400'>{index + 1}</p>
        <img className='w-[45px] h-[45px] shrink-0 rounded-full' src={`https://assets.nhle.com/mugs/nhl/20262027/${player.teamAbbrevs.split(',').pop()!.trim()}/${player.playerId}.png`} alt={`${player.name} headshot`}/>
        <p className='font-semibold'>{player.name}</p>
        <span className='flex-1 text-xs text-gray-500'>{player.teamAbbrevs}</span>
      </div>
        <p>{player.positionCode}{(player.positionCode === 'L' || player.positionCode === 'R') && 'W'}</p>
        <p>{player.gamesPlayed}</p>
        <p>{player.goals}</p>
        <p>{player.assists}</p>
        <p>{player.points}</p>
        <p>{player.plusMinus}</p>
        <p>{formatTOI(player.timeOnIcePerGame)}</p>
        <p>{player.penaltyMinutes}</p>
    </div>
  )
}

const columns: { label: string; key: keyof SkaterStats; sortable? : boolean }[] = [
  { label: 'Player', key: 'name', sortable: false },
  { label: 'Pos', key: 'positionCode', sortable: false },
  { label: 'GP', key: 'gamesPlayed', sortable: false },
  { label: 'G', key: 'goals' },
  { label: 'A', key: 'assists' },
  { label: 'Pts', key: 'points' },
  { label: 'P/M', key: 'plusMinus' },
  { label: 'TOI', key: 'timeOnIcePerGame' },
  { label: 'PIM', key: 'penaltyMinutes' },
]

function SkaterTable({ skaters, initialSort }: { skaters: SkaterStats[]; initialSort: string }) {
  const [sortKey, setSortKey] = useState<keyof SkaterStats>(initialSort as keyof SkaterStats)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [position, setPosition] = useState('ALL')
  const [rowLimit, setRowLimit] = useState(100)

  function handleSort(key: keyof SkaterStats) {
    if (key === sortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }
  
  const rows = [...skaters]
    .filter((s) =>
      position === 'ALL' ||
      (position === 'F' ? ['C', 'L', 'R'].includes(s.positionCode) : s.positionCode === position)
    )
    .sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'string' && typeof bv === 'string'
        ? av.localeCompare(bv)
        : Number(av) - Number(bv)
      return sortDir === 'asc' ? cmp : -cmp
    })
    .slice(0, rowLimit)

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='flex'>
        <h1 className='flex-1 text-4xl font-bold mb-5'>Skater Statistics</h1>
        <div className='flex items-end gap-3 mb-2 font-semibold'>
          <select className='bg-white border-1 border-gray-300 rounded pl-2 pr-3 py-3' value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value='ALL'>All Positions</option>
            <option value='F'>Forwards</option>
            <option value='D'>Defense</option>
          </select>

          <select className='bg-white border-1 border-gray-300 rounded px-2 py-3' value={rowLimit} onChange={(e) => setRowLimit(Number(e.target.value))}>
            <option value={25}>25 Rows</option>
            <option value={50}>50 Rows</option>
            <option value={100}>100 Rows</option>
            <option value={200}>200 Rows</option>
          </select>
        </div>
      </div>
      <div className='max-w-7xl mx-auto mb-5 rounded-md bg-white overflow-hidden'>
        <div className={`${tableCols} py-2 bg-[#e6e6e6] font-semibold`}>
          {columns.map((c) => 
            c.sortable === false ? ( <span key={c.key}>{c.label}</span>) : (
            <button
              key={c.key}
              onClick={() => handleSort(c.key)}
              className='text-left hover:underline cursor-pointer'
            >
              {c.label}
              {sortKey === c.key && (sortDir === 'asc' ? '▲' : '▼')}
            </button>
          ))}
        </div>
        {rows.map((s, i) => (
          <Player key={s.playerId} index={i} player={s}/>
        ))}
      </div>
    </div>
  )
}

export default SkaterTable