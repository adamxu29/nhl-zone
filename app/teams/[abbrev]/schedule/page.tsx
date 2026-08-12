import TeamSchedule from "@/components/teams/[abbrev]/schedule/TeamSchedule";

// the header + bg wrapper live in the parent layout.tsx
export default async function page({ params }: { params: Promise<{ abbrev: string }> }) {
  const { abbrev } = await params
  return <TeamSchedule abbrev={abbrev}/>
}
