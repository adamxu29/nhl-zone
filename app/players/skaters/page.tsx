import SkaterTable from "@/components/players/SkaterTable";
import { fetchSkaters } from "@/lib/nhlStats";

export default async function page({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort } = await searchParams
  const skaters = await fetchSkaters()
  return (
      <div className="bg-[#f2f2f2] relative">
        <SkaterTable skaters={skaters} initialSort={sort ?? 'points'}/>
      </div>
  );
};
