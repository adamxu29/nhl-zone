import TeamHeader from "@/components/teams/[abbrev]/TeamHeader";

/**
 * Wraps every route under /teams/[abbrev]. React keeps this subtree mounted
 * when navigating between the tabs, so the header doesn't re-render or flicker.
 */
export default async function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ abbrev: string }>
}) {
  const { abbrev } = await params

  return (
    <div className="bg-[#f2f2f2] relative">
      <TeamHeader abbrev={abbrev}/>
      {children}
    </div>
  );
}
