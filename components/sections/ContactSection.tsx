import { Mail } from "lucide-react";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { Panel, SectionTitle } from "@/components/ui/Panel";
import { getIcon } from "@/lib/icons";
import { site } from "@/lib/site";
import type { Profile, SocialLink } from "@/lib/types";

export function ContactSection({ profile, socials }: { profile: Profile; socials: SocialLink[] }) {
  const links = [
    ...(profile.email
      ? [{ key: "email", label: "Email me", href: `mailto:${profile.email}`, Icon: Mail, external: false }]
      : []),
    ...socials.map((social) => ({
      key: `social-${social.id}`,
      label: social.label,
      href: social.url,
      Icon: getIcon(social.iconKey),
      external: true,
    })),
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
          Planning an event, a website or a visual project? Send me a message.
        </p>

        <ul className="flex w-full max-w-3xl flex-wrap items-stretch justify-center bg-ink p-1 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)] sm:divide-x sm:divide-white/15">
          {links.map(({ key, label, href, Icon, external }) => (
            <li key={key} className="flex flex-1 basis-[140px] justify-center">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group relative flex w-full items-center justify-center gap-2 px-4 py-3.5 font-hud text-sm font-bold uppercase tracking-wider text-white transition-[background-color,box-shadow] duration-200 ease-snap hover:bg-accent hover:text-ink hover:shadow-[0_0_28px_-4px_rgb(242_90_29/0.8)] active:animate-bloom"
              >
                <Icon
                  aria-hidden="true"
                  className="size-[18px] transition-transform duration-200 ease-snap group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
                {label}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-2 font-hud text-xs font-semibold uppercase tracking-wider text-steel">
          © {site.copyrightYear} {site.name}. Built with Next.js, Tailwind CSS and PostgreSQL.
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
