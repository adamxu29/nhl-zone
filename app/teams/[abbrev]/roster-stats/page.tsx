import RosterStats from "@/components/teams/[abbrev]/roster-stats/RosterStats";
import { fetchSkaters, fetchGoalies } from "@/lib/nhlStats";
import { supabase } from "@/lib/supabase";

export default async function page({ params }: { params: Promise<{ abbrev?: string }> }) {
  const { abbrev } = await params
  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .eq('abbrev', abbrev)
    .single()
  if(error) return <div>Error loading team: {error.message}</div>

  const [skaters, goalies] = await Promise.all([
    fetchSkaters(team.id),
    fetchGoalies(team.id)
  ])

  return (
      <div className="bg-[#f2f2f2] relative">
        <RosterStats skaters={skaters} goalies={goalies}/>
      </div>
  );
};
