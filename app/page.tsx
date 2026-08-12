import Image from "next/image";
import GetStarted from "@/components/home/GetStarted"
import TodaysGames from "@/components/home/TodaysGames";

export const revalidate = 60

export default async function Home() {
  return (
    <main>
      <GetStarted/>
      <TodaysGames/>
    </main>
  )
}