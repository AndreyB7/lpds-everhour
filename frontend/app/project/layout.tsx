import { ReactNode } from "react";
import SecondaryNav from "@/components/SecondaryNav";

const projects = [
  { label: 'COA', url: '/project/coa' },
  { label: 'SVT', url: '/project/svt' },
]

export default async function Projects({ children }: {
  children: ReactNode
}) {
  return (
    <>
      <SecondaryNav links={projects}/>
      { children }
    </>
  );
};
