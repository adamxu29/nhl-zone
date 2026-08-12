import GoalieTable from "@/components/players/GoalieTable";
import { fetchGoalies } from "@/lib/nhlStats";

export default async function page({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort } = await searchParams
  const goalies = await fetchGoalies()
  return (
      <div className="bg-[#f2f2f2] relative">
        <GoalieTable goalies={goalies} initialSort={sort ?? 'wins'}/>
      </div>
  );
};
