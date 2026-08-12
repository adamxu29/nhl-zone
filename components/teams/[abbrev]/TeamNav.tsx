'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: 'Home', segment: '', ready: true },
  { label: 'Schedule', segment: '/schedule', ready: true },
  { label: 'Roster Stats', segment: '/roster', ready: false },
]

function TeamNav({ abbrev }: { abbrev: string }) {
  const pathname = usePathname()

  return (
    <nav className='flex gap-8 items-center text-white max-w-7xl mx-auto h-12'>
      {tabs.map((t) => {
        const href = `/teams/${abbrev}${t.segment}`

        if (!t.ready) {
          return (
            <span key={t.label} className='opacity-40 cursor-default'>
              {t.label}
            </span>
          )
        }

        const active = pathname === href
        return (
          <Link
            key={t.label}
            href={href}
            className={`flex items-center h-full border-b-2 ${
              active ? 'border-white font-semibold' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default TeamNav
