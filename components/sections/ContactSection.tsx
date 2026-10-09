import { Mail } from "lucide-react";
import { AssetHint, AssetSlot } from "@/components/ui/AssetSlot";
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
        <SectionTitle id="contact-title">Contact info</SectionTitle>
        <p className="max-w-[46ch] text-[15px] text-mist">
          Planning an event, a website or a visual project? Send me a message.
        </p>

        <ul className="flex w-full max-w-3xl flex-wrap items-stretch justify-center gap-2 rounded-[26px] bg-night/80 p-2 ring-2 ring-ink/70 backdrop-blur-md sm:gap-0 sm:divide-x sm:divide-line">
          {links.map(({ key, label, href, Icon, external }) => (
            <li key={key} className="flex flex-1 basis-[140px] justify-center">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-ink transition-[background-color,color,transform] duration-500 ease-juice hover:bg-raised hover:text-cyan active:scale-95"
              >
                <Icon
                  aria-hidden="true"
                  className="size-5 transition-transform duration-500 ease-juice group-hover:-translate-y-0.5 group-hover:-rotate-12 group-hover:scale-110"
                  strokeWidth={2.2}
                />
                {label}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-2 text-xs text-mist/80">
          © {site.copyrightYear} {site.name}. Built with Next.js, Tailwind CSS and PostgreSQL.
        </p>
      </div>
    </Panel>
  );
}

function ScenePlaceholder() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-raised/60 via-frame to-frame" />
      <div className="absolute inset-0 bg-[linear-gradient(rgb(57_66_159/0.35)_1px,transparent_1px),linear-gradient(90deg,rgb(57_66_159/0.35)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_50%_35%,black_20%,transparent_70%)]" />
      <div className="absolute left-[12%] top-[18%] size-40 rounded-full bg-cyan/25 blur-3xl" />
      <div className="absolute right-[10%] top-[8%] size-56 rounded-full bg-lilac/25 blur-3xl" />
      <div className="absolute left-1/2 top-[30%] size-24 -translate-x-1/2 rounded-full bg-blush/20 blur-2xl" />
      <AssetHint position="top">/images/contact/scene.webp (set in lib/site.ts)</AssetHint>
    </div>
  );
}
