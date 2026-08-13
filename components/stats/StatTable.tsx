'use client'

import { useState } from 'react'
import type { PlayerBase, StatColumn } from '@/lib/types'

/** Optional second dropdown, e.g. the skaters' Forwards/Defense filter. */
interface TableFilter<T> {
  defaultValue: string
  options: { label: string; value: string }[]
  predicate: (item: T, value: string) => boolean
}

/**
 * A sortable, filterable stat table. Generic over the row type and driven entirely
 * by a column config, so skaters, goalies, and team rosters all share one implementation.
 */
function StatTable<T extends PlayerBase>({
  title,
  rows,
  columns,
  gridCols,
  initialSort,
  minWidth = 'min-w-[800px]',
  rowLimits = [25, 50, 100, 200],
  defaultRowLimit = 100,
  showRowLimit = true,
  filter,
}: {
  title: string
  rows: T[]
  columns: StatColumn<T>[]
  /** responsive grid-template class string, shared by the header and every row */
  gridCols: string
  initialSort: string
  minWidth?: string
  rowLimits?: number[]
  defaultRowLimit?: number
  /** false hides the dropdown and shows every row — for short lists like a team roster */
  showRowLimit?: boolean
  filter?: TableFilter<T>
}) {
  /** a column's own `asc` decides which way it sorts the first time it's clicked */
  const startsAscending = (key: unknown) =>
    columns.find((c) => c.key === key)?.asc ? 'asc' : 'desc'

  const [sortKey, setSortKey] = useState<keyof T>(initialSort as keyof T)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(startsAscending(initialSort))
  const [rowLimit, setRowLimit] = useState(defaultRowLimit)
  const [filterValue, setFilterValue] = useState(filter?.defaultValue ?? '')

  // clicking the active column flips direction; a new column starts at its own default
  function handleSort(key: keyof T) {
    if (key === sortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir(startsAscending(key))
    }
  }

  // derived, not stored: recomputed from rows + the state values on every render
  const visible = rows
    .filter((item) => (filter ? filter.predicate(item, filterValue) : true))
    .sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp =
        typeof av === 'string' && typeof bv === 'string'
          ? av.localeCompare(bv)
          : Number(av) - Number(bv)
      return sortDir === 'asc' ? cmp : -cmp
    })
    // slice(0, undefined) keeps everything
    .slice(0, showRowLimit ? rowLimit : undefined)

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='flex'>
        <h1 className='flex-1 text-4xl font-bold mb-5'>{title}</h1>
        <div className='flex flex-col md:flex-row items-end gap-3 mb-2 font-semibold'>
          {showRowLimit && (
            <select
              className='bg-white border-1 border-gray-300 rounded px-2 py-3'
              value={rowLimit}
              onChange={(e) => setRowLimit(Number(e.target.value))}
            >
              {rowLimits.map((n) => (
                <option key={n} value={n}>{n} Rows</option>
              ))}
            </select>
          )}

          {filter && (
            <select
              className='bg-white border-1 border-gray-300 rounded pl-2 pr-3 py-3'
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              {filter.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className='max-w-7xl mx-auto mb-5 rounded-md bg-white overflow-hidden'>
        <div className='overflow-x-auto'>
          <div className={minWidth}>
            <div className={`${gridCols} py-2 bg-[#e6e6e6] font-semibold`}>
              {columns.map((c) =>
                c.sortable === false ? (
                  <span key={String(c.key)} className='whitespace-nowrap'>{c.label}</span>
                ) : (
                  <button
                    key={String(c.key)}
                    onClick={() => handleSort(c.key)}
                    className='text-left whitespace-nowrap hover:underline cursor-pointer'
                  >
                    {c.label}
                    {sortKey === c.key && (sortDir === 'asc' ? '▲' : '▼')}
                  </button>
                )
              )}
            </div>

            {visible.map((item, i) => (
              <div
                key={item.playerId}
                className={`${gridCols} py-1 border-b border-gray-200 text-sm`}
              >
                {columns.map((c) => {
                  const value = item[c.key]
                  return (
                    <div key={String(c.key)}>
                      {c.render
                        ? c.render(item, i)
                        : c.format
                          ? c.format(Number(value))
                          : String(value)}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatTable
