export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6">
      <section className="py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
          Portfolio
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
          Hi, I&apos;m Zach.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Placeholder intro: one or two sentences about what you do and what you
          want visitors to remember.
        </p>
      </section>

      <section
        id="about"
        className="border-t border-neutral-200 py-16 dark:border-neutral-800"
      >
        <h2 className="text-2xl font-semibold">About</h2>
      </section>

      <section
        id="projects"
        className="border-t border-neutral-200 py-16 dark:border-neutral-800"
      >
        <h2 className="text-2xl font-semibold">Projects</h2>
      </section>

      <section
        id="contact"
        className="border-t border-neutral-200 py-16 dark:border-neutral-800"
      >
        <h2 className="text-2xl font-semibold">Contact</h2>
      </section>
    </main>
  );
}
