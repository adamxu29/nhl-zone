import GamePredictor from "@/components/game-predictor/GamePredictor";
import { supabase } from "@/lib/supabase";

export default async function page() {
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
    .order('name')

  if (error) return <div>Error loading teams: {error.message}</div>

  return (
    <div className="bg-[#f2f2f2] relative">
      <GamePredictor teams={teams}/>
    </div>
  )
}