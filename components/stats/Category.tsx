import Link from 'next/link'
import type { PlayerBase } from '@/lib/types'

function Category<T extends PlayerBase>({ title, href, players, statKey, format }: {
  title: string
  href: string
  players: T[]
  statKey: keyof T
  format?: (value: number) => string
}) {
  return(
    <div className='p-4'>
      <Link href={href}>
        <h3 className='font-semibold mb-2 hover:underline'>{title}</h3>
      </Link>
      <ol className='text-sm'>
        {players.map((p, i) => (
          <li key={p.playerId} className='flex items-center gap-2 py-1'>
            <span className='w-4 text-gray-400'>{i + 1}</span>
            <span className='truncate'>{p.name}</span>
            <span className='flex-1 text-xs text-gray-500'>{p.teamAbbrevs}</span>
            <span className='font-bold tabular-nums'>
              {format ? format(Number(p[statKey])) : String(p[statKey])}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Category
