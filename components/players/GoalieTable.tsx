'use client'
import React from 'react'
import { useState } from 'react'
import { GoalieStats } from '@/lib/types'

const tableCols = 'grid grid-cols-[2fr_0.5fr_0.5fr_0.6fr_0.6fr_0.5fr_0.5fr_0.7fr_0.6fr] md:grid-cols-[2.4fr_0.5fr_0.5fr_0.6fr_0.6fr_0.5fr_0.5fr_0.7fr_0.6fr] items-center gap-x-2 px-3 md:px-4'

function Goalie({ goalie, index }: { goalie: GoalieStats; index: number }){
  return(
    <div className={`${tableCols} py-1 border-b border-gray-200 text-sm`}>
      <div className='flex items-center gap-2 md:gap-3'>
        <p className='w-5 text-gray-400'>{index + 1}</p>
        <img className='hidden md:flex w-[35px] h-[35px] md:w-[45px] md:h-[45px] shrink-0 rounded-full' src={`https://assets.nhle.com/mugs/nhl/20262027/${goalie.teamAbbrevs.split(',').pop()!.trim()}/${goalie.playerId}.png`} alt={`${goalie.name} headshot`}/>
        <p className='text-sm md:text-md font-semibold'>{goalie.name}</p>
        <span className='text-xs text-gray-500'>{goalie.teamAbbrevs}</span>
      </div>
        <p>{goalie.gamesPlayed}</p>
        <p>{goalie.gamesStarted}</p>
        <p>{goalie.savePct}</p>
        <p>{goalie.goalsAgainstAverage}</p>
        <p>{goalie.shutouts}</p>
        <p>{goalie.wins}</p>
        <p>{goalie.losses}</p>
        <p>{goalie.otLosses}</p>
    </div>
  )
}

const columns: { label: string; key: keyof GoalieStats; sortable? : boolean, asc?: boolean }[] = [
  { label: 'Player', key: 'name', sortable: false },
  { label: 'GP', key: 'gamesPlayed', sortable: false },
  { label: 'GS', key: 'gamesStarted', sortable: false },
  { label: 'SV %', key: 'savePct' },
  { label: 'GAA', key: 'goalsAgainstAverage', asc: true },
  { label: 'SO', key: 'shutouts' },
  { label: 'W', key: 'wins' },
  { label: 'L', key: 'losses', asc: true },
  { label: 'OTL', key: 'otLosses' },
]

function GoalieTable({ goalies, initialSort }: { goalies: GoalieStats[]; initialSort: string }) {
  const [sortKey, setSortKey] = useState<keyof GoalieStats>(initialSort as keyof GoalieStats)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(
    columns.find((c) => c.key === initialSort)?.asc ? 'asc' : 'desc'
  )
  const [rowLimit, setRowLimit] = useState(25)

  function handleSort(key: keyof GoalieStats) {
    if (key === sortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir(columns.find((c) => c.key === key)?.asc ? 'asc' : 'desc')
    }
  }
  
  const rows = [...goalies]
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
        <h1 className='flex-1 text-4xl font-bold mb-5'>Goalie Statistics</h1>
        <div className='flex items-end gap-3 mb-2 font-semibold'>
          <select className='bg-white border-1 border-gray-300 rounded px-2 py-3' value={rowLimit} onChange={(e) => setRowLimit(Number(e.target.value))}>
            <option value={25}>25 Rows</option>
            <option value={50}>50 Rows</option>
            <option value={100}>100 Rows</option>
          </select>
        </div>
      </div>
      <div className='max-w-7xl mx-auto mb-5 rounded-md bg-white overflow-hidden'>
        <div className='overflow-x-auto'>
          <div className='min-w-[800px]'>
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
              <Goalie key={s.playerId} index={i} goalie={s}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoalieTable