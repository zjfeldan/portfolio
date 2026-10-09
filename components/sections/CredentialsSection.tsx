import { Award, ExternalLink, GraduationCap } from "lucide-react";
import { AssetHint, AssetSlot } from "@/components/ui/AssetSlot";
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

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-5">
        {/* Certificates */}
        <div className="flex flex-col">
          <SectionTitle>Certificates</SectionTitle>
          <Tray className="mt-4 flex-1">
            {certificates.length > 0 ? (
              <Rail label="Certificates" className="h-full">
                {certificates.map((certificate) => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </Rail>
            ) : (
              <EmptyCertificates />
            )}
          </Tray>
        </div>

        <div className="flex flex-col gap-6 lg:gap-5">
          {/* Experience */}
          <div>
            <SectionTitle>Experience</SectionTitle>
            <Tray className="mt-4">
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
            <Tray className="mt-4">
              <ul className="flex flex-col gap-3">
                {education.map((item) => (
                  <li key={item.id} className="flex items-start gap-4 rounded-2xl p-2">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cyan text-night">
                      <GraduationCap aria-hidden="true" className="size-6" strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-bold leading-snug text-ink">{item.degree}</p>
                      <p className="mt-0.5 text-sm text-mist">{item.school}</p>
                      <p className="mt-1 text-xs font-semibold text-lilac">
                        {item.status === "in_progress"
                          ? `${item.startYear ?? ""}${item.startYear ? " – " : ""}In progress`
                          : yearRange(item.startYear, item.endYear)}
                      </p>
                      {item.details ? (
                        <p className="mt-1 text-[13px] leading-snug text-mist">{item.details}</p>
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
          className="rounded-2xl bg-panel p-4 ring-1 ring-line/70 transition-[transform,box-shadow] duration-500 ease-juice hover:-translate-y-0.5 hover:ring-cyan/50 hover:shadow-[0_14px_30px_-16px_rgb(91_224_255/0.5)]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="font-display text-sm font-bold text-ink">{item.role}</p>
            <p className="text-xs font-semibold text-lilac">{yearRange(item.startDate, item.endDate)}</p>
          </div>
          <p className="mt-1 text-sm text-mist">
            {item.organization}
            {item.location ? `, ${item.location}` : ""}
          </p>
          {item.highlights.length > 0 ? (
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-[13px] leading-snug text-mist marker:text-cyan">
              {item.highlights.map((line) => (
                <li key={line}>{line}</li>
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
    <article className="group flex shrink-0 basis-full snap-start flex-col gap-3 rounded-[22px] bg-panel p-3 ring-1 ring-line/70">
      <AssetSlot
        src={certificate.imageUrl}
        alt={`${certificate.title} certificate`}
        sizes="(min-width: 1024px) 520px, 90vw"
        className="aspect-[4/3] rounded-2xl bg-night/60 ring-1 ring-line/60"
        imageClassName="object-contain p-2 transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
      >
        <div className="grid h-full place-items-center">
          <Award aria-hidden="true" className="size-12 text-ink/25" strokeWidth={1.6} />
        </div>
        <AssetHint>/images/certificates/your-file.webp</AssetHint>
      </AssetSlot>
      <div className="flex items-start justify-between gap-3 px-1 pb-1">
        <div className="min-w-0">
          <h3 className="font-display text-sm font-bold leading-snug text-ink">{certificate.title}</h3>
          <p className="mt-0.5 text-sm text-mist">
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
            className="grid size-9 shrink-0 place-items-center rounded-full bg-raised text-ink transition-transform duration-500 ease-juice hover:scale-110 hover:bg-cyan hover:text-night active:scale-90"
          >
            <ExternalLink aria-hidden="true" className="size-4" strokeWidth={2.4} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function EmptyCertificates() {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-[22px] border-2 border-dashed border-line/80 p-6 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-raised text-ink/70">
        <Award aria-hidden="true" className="size-7" strokeWidth={2} />
      </span>
      <p className="font-display text-sm font-bold text-ink">Certificates are on the way</p>
      <p className="max-w-[34ch] text-sm text-mist">
        New certificates will appear here as I complete them.
      </p>
      {process.env.NODE_ENV !== "production" ? (
        <p className="max-w-[40ch] text-xs text-lilac">
          Dev note: add rows to the certificates table to replace this card.
        </p>
      ) : null}
    </div>
  );
}
