import { ReactNode } from "react";
import SecondaryNav from "@/components/SecondaryNav";

type TeamMember = {
  name: string,
  id: number
}

async function getTeam(): Promise<TeamMember[]> {
  const res: Response = await fetch(`${ process.env.NEXT_PUBLIC_API_URL }/team`, { next: { revalidate: process.env.NODE_ENV == 'development' ? 0 : 3600 } })
  return res.json()
}

export default async function Projects({ children }: {
  children: ReactNode
}) {
  const team = await getTeam()
  const teamLinks = team.map(member => (
    {
      label: member.name,
      url: `/team/${member.id}`
    }
  ))
  return (
    <>
      <SecondaryNav links={teamLinks}/>
      { children }
    </>
  );
};
