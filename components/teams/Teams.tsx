import { supabase } from '@/lib/supabase'
import Conference from './Conference'
import { TeamData } from '@/lib/types'

export default async function TeamsPage() {
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
    .order('conference', { ascending: true })
    .order('division', { ascending: true })
    .order('name', { ascending: true })
    .overrideTypes<TeamData[], { merge: false }>()

  if (error) return <div>Error loading teams: {error.message}</div>

  const grouped = teams.reduce((acc, team) => {
    acc[team.conference] ??= {}
    acc[team.conference][team.division] ??= []
    acc[team.conference][team.division].push(team)
    return acc
  }, {} as Record<string, Record<string, TeamData[]>>)

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold">NHL Teams</h1>
      {Object.entries(grouped).map(([confName, divisions]) => (
        <Conference key={confName} name={confName} divisions={divisions} />
      ))}
    </main>
  )
}