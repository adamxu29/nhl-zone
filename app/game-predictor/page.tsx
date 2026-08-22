import { Suspense } from "react";
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
      {/* GamePredictor reads ?home= &away= via useSearchParams, which can't be known
          at build time — the boundary lets Next prerender a shell and fill this in
          on the client. */}
      <Suspense fallback={<div className="max-w-7xl mx-auto p-6 h-screen" />}>
        <GamePredictor teams={teams}/>
      </Suspense>
    </div>
  )
}
