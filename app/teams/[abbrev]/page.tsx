import TeamHome from "@/components/teams/[abbrev]/TeamHome";

// the header + bg wrapper now live in layout.tsx
export default async function page({ params }: { params: Promise<{ abbrev: string }> }) {
  const { abbrev } = await params
  return <TeamHome abbrev={abbrev}/>
}
