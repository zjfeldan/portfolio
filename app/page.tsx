import { DevDataNotice } from "@/components/DevDataNotice";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CredentialsSection } from "@/components/sections/CredentialsSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { getPortfolio } from "@/lib/portfolio";

export default async function Home() {
  const { data, source } = await getPortfolio();

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

      {source === "fallback" && process.env.NODE_ENV !== "production" ? <DevDataNotice /> : null}
    </>
  );
}
