import { Download, Mail } from "lucide-react";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { Panel, SectionTitle } from "@/components/ui/Panel";
import { SkillIcon } from "@/components/ui/SkillIcon";
import { site } from "@/lib/site";
import type { Profile, SocialLink } from "@/lib/types";

export function ContactSection({ profile, socials }: { profile: Profile; socials: SocialLink[] }) {
  const iconClass = "size-[18px] transition-transform duration-200 ease-snap group-hover:-translate-y-0.5";

  const links: {
    key: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    kind: "email" | "external" | "download";
  }[] = [
    ...(profile.email
      ? [{
          key: "email",
          label: "Email me",
          href: `mailto:${profile.email}`,
          icon: <Mail aria-hidden="true" className={iconClass} strokeWidth={2} />,
          kind: "email" as const,
        }]
      : []),
    ...socials.map((social) => ({
      key: `social-${social.id}`,
      label: social.label,
      href: social.url,
      icon: <SkillIcon iconKey={social.iconKey} iconUrl={null} size={18} className={iconClass} />,
      kind: "external" as const,
    })),
    // Shown once profile.resume_url points to your PDF in public/files/
    ...(profile.resumeUrl
      ? [{
          key: "cv",
          label: "Download CV",
          href: profile.resumeUrl,
          icon: <Download aria-hidden="true" className={iconClass} strokeWidth={2.2} />,
          kind: "download" as const,
        }]
      : []),
  ];

  return (
    <Panel id="contact" labelledBy="contact-title" className="overflow-hidden p-0!">
      {/* Large visual area (your background art goes here) */}
      <AssetSlot
        src={site.contactSceneSrc}
        alt=""
        sizes="(min-width: 1180px) 1180px, 100vw"
        className="h-[clamp(280px,40vw,460px)]"
      >
        <ScenePlaceholder />
      </AssetSlot>

      <div className="relative -mt-20 flex flex-col items-center gap-4 px-4 pb-6 text-center sm:-mt-24 sm:px-8 sm:pb-8">
        <SectionTitle id="contact-title" className="items-center">
          Contact info
        </SectionTitle>
        <p className="max-w-[46ch] text-[15px] text-steel">
          Send me a message.
        </p>

        <ul className="flex w-full max-w-3xl flex-wrap items-stretch justify-center bg-ink p-1 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)] sm:divide-x sm:divide-white/15">
          {links.map(({ key, label, href, icon, kind }) => (
            <li key={key} className="flex flex-1 basis-[140px] justify-center">
              <a
                href={href}
                {...(kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(kind === "download" ? { download: "" } : {})}
                className="group relative flex w-full items-center justify-center gap-2 whitespace-nowrap px-4 py-3.5 font-hud text-sm font-bold uppercase tracking-wider text-white transition-[background-color,box-shadow] duration-200 ease-snap hover:bg-accent hover:text-ink hover:shadow-[0_0_28px_-4px_rgb(242_90_29/0.8)] active:animate-bloom"
              >
                {icon}
                {label}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-2 font-hud text-xs font-semibold tracking-wider text-steel">
          © {site.copyrightYear} {site.name}
        </p>
      </div>
    </Panel>
  );
}

function ScenePlaceholder() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-sunken">
      <div className="absolute inset-0 bg-[linear-gradient(rgb(14_14_14/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(14_14_14/0.06)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black_30%,transparent_85%)]" />
      <span className="absolute -right-10 top-[22%] h-px w-[35%] -rotate-[18deg] bg-ink/40" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-surface" />
    </div>
  );
}
