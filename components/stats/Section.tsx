import type { PlayerBase, StatCategory } from '@/lib/types'
import Category from './Category'

function Section<T extends PlayerBase>({ title, players, sections, basePath, topN = 10 }: {
  title: string
  players: T[]
  sections: StatCategory<T>[]
  basePath: string
  topN?: number
}) {
  return(
    <div className='max-w-7xl mx-auto mb-5 rounded-md bg-white overflow-hidden'>
      <h2 className='text-xl font-semibold pl-4 py-1 bg-black text-white'>{title}</h2>
      <div className='grid grid-cols-3 gap-px bg-gray-200'>
        {sections.map((s) => {
          const top = [...players]
            .sort((a, b) => {
              const av = Number(a[s.key])
              const bv = Number(b[s.key])
              return s.asc ? av - bv : bv - av
            })
            .slice(0, topN)
          return (
            <div key={s.label} className='bg-white'>
              <Category
                title={s.label}
                href={`${basePath}?sort=${String(s.key)}`}
                players={top}
                statKey={s.key}
                format={s.format}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Section
