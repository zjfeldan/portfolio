import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CredentialsSection } from "@/components/sections/CredentialsSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { getPortfolio } from "@/lib/portfolio";

export default async function Home() {
  // If the database can't be reached, sample content shows and the terminal
  // running `npm run dev` prints a warning explaining why.
  const { data } = await getPortfolio();

  return (
    <>
      <AboutSection profile={data.profile} />
      <WorkSection categories={data.categories} skills={data.skills} />
      <CredentialsSection
        certificates={data.certificates}
        experiences={data.experiences}
        education={data.education}
      />
      <ContactSection profile={data.profile} socials={data.socials} />
    </>
  );
}
