import PlayerHeader from "@/components/players/[id]/PlayerHeader";

export default async function PlayerLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    return(
        <div className="bg-[#f2f2f2] relative">
            <PlayerHeader id={Number(id)}/>
            {children}
        </div>
    )

}