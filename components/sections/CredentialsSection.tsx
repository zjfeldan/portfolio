import { Award, ExternalLink, GraduationCap } from "lucide-react";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { Expandable } from "@/components/ui/Expandable";
import { Panel, SectionTitle, Tray } from "@/components/ui/Panel";
import { Rail } from "@/components/ui/Rail";
import { yearOf, yearRange } from "@/lib/format";
import type { Certificate, Education, Experience } from "@/lib/types";

/** How many experience cards show before the "show more" chevron */
const EXPERIENCE_PREVIEW = 2;

export function CredentialsSection({
  certificates,
  experiences,
  education,
}: {
  certificates: Certificate[];
  experiences: Experience[];
  education: Education[];
}) {
  const first = experiences.slice(0, EXPERIENCE_PREVIEW);
  const rest = experiences.slice(EXPERIENCE_PREVIEW);

  return (
    <Panel id="credentials" labelledBy="credentials-title">
      <h2 id="credentials-title" className="sr-only">
        Certificates, experience and education
      </h2>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-6">
        {/* Certificates */}
        <div className="flex flex-col">
          <SectionTitle>Certificates</SectionTitle>
          <Tray className="mt-5 flex-1">
            {certificates.length > 0 ? (
              <Rail label="Certificates" counter className="h-full">
                {certificates.map((certificate) => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </Rail>
            ) : (
              <EmptyCertificates />
            )}
          </Tray>
        </div>

        <div className="flex flex-col gap-8 lg:gap-6">
          {/* Experience */}
          <div>
            <SectionTitle>Experience</SectionTitle>
            <Tray className="mt-5">
              <Expandable
                visible={<ExperienceList items={first} />}
                more={rest.length > 0 ? <ExperienceList items={rest} className="pt-3" /> : undefined}
                moreLabel="Show more experience"
                lessLabel="Show less experience"
              />
            </Tray>
          </div>

          {/* Education */}
          <div>
            <SectionTitle>Education</SectionTitle>
            <Tray className="mt-5">
              <ul className="flex flex-col divide-y divide-line">
                {education.map((item) => (
                  <li key={item.id} className="flex items-start gap-4 py-3 first:pt-1 last:pb-1">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white">
                      <GraduationCap aria-hidden="true" className="size-5" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-extrabold uppercase leading-snug text-ink">
                        {item.degree}
                      </p>
                      <p className="mt-0.5 text-sm text-steel">{item.school}</p>
                      <p className="mt-1 font-hud text-xs font-bold uppercase tracking-wider text-accent-ink">
                        {item.status === "in_progress"
                          ? `${item.startYear ?? ""}${item.startYear ? " – " : ""}In progress`
                          : yearRange(item.startYear, item.endYear)}
                      </p>
                      {item.details ? (
                        <p className="mt-1 text-[13px] leading-snug text-steel">{item.details}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </Tray>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function ExperienceList({ items, className = "" }: { items: Experience[]; className?: string }) {
  return (
    <ul className={`flex flex-col gap-3 ${className}`}>
      {items.map((item) => (
        <li
          key={item.id}
          className="group relative border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-200 ease-snap hover:border-ink hover:shadow-[0_14px_30px_-20px_rgb(0_0_0/0.45)]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="font-display text-sm font-extrabold uppercase text-ink">{item.role}</p>
            <p className="font-hud text-xs font-bold uppercase tracking-wider text-accent-ink">
              {yearRange(item.startDate, item.endDate)}
            </p>
          </div>
          <p className="mt-1 text-sm text-steel">
            {item.organization}
            {item.location ? `, ${item.location}` : ""}
          </p>
          {item.highlights.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1 text-[13px] leading-snug text-graphite">
              {item.highlights.map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[7px] size-1 shrink-0 bg-accent" />
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const year = yearOf(certificate.issuedOn);
  return (
    <article className="group flex shrink-0 basis-full snap-start flex-col gap-3 border border-line bg-surface p-3">
      <AssetSlot
        src={certificate.imageUrl}
        alt={`${certificate.title} certificate`}
        sizes="(min-width: 1024px) 520px, 90vw"
        className="hud-corners aspect-[4/3] bg-sunken"
        imageClassName="object-contain p-2 grayscale transition-[filter] duration-500 ease-snap group-hover:grayscale-0"
      >
        <div className="grid h-full place-items-center">
          <Award aria-hidden="true" className="size-12 text-line" strokeWidth={1.6} />
        </div>
      </AssetSlot>
      <div className="flex items-start justify-between gap-3 px-1 pb-1">
        <div className="min-w-0">
          <h3 className="font-display text-sm font-extrabold uppercase leading-snug text-ink">
            {certificate.title}
          </h3>
          <p className="mt-0.5 text-sm text-steel">
            {certificate.issuer}
            {year ? `, ${year}` : ""}
          </p>
        </div>
        {certificate.credentialUrl ? (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Verify ${certificate.title}`}
            className="grid size-9 shrink-0 place-items-center bg-ink text-white transition-colors duration-200 ease-snap hover:bg-accent hover:text-ink active:animate-bloom"
          >
            <ExternalLink aria-hidden="true" className="size-4" strokeWidth={2.2} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function EmptyCertificates() {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 border-2 border-dashed border-line p-6 text-center">
      <span className="grid size-14 place-items-center bg-ink text-white">
        <Award aria-hidden="true" className="size-7" strokeWidth={2} />
      </span>
      <p className="font-display text-sm font-extrabold uppercase text-ink">Certificates are on the way</p>
      <p className="max-w-[34ch] text-sm text-steel">New certificates will appear here as I complete them.</p>
    </div>
  );
}
