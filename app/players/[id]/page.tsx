import PlayerProfile from "@/components/players/[id]/PlayerProfile"


export default async function page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  return <PlayerProfile id={id}/>
}
