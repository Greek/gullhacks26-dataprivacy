import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center p-6">
      <section className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold">
          About Secure &amp; Memorable Password Generator
        </h1>

        <p className="mb-6 text-gray-600">
          Secure &amp; Memorable Password Generator is a cybersecurity project
          developed during GullHacks 2026. Our goal is to help users generate
          strong, unpredictable passwords that are still easy to remember.
        </p>

        <h2 className="mb-3 text-xl font-semibold">Features</h2>

        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-600">
          <li>Word-based memorable password generation</li>
          <li>Title Case base phrase preview to help you remember words</li>
          <li>
            Capitalization options: Title Case, Random, Lowercase, and Full Case
          </li>
          <li>
            Word separator options: random numbers (0–9), dashes (-),
            underscores (_), and periods (.)
          </li>
          <li>Real-time password strength evaluation and guidance</li>
          <li>One-click copy to clipboard</li>
          <li>Optional special-character substitutions</li>
          <li>Customizable password length</li>
        </ul>

        <h2 className="mb-3 text-xl font-semibold">Technologies</h2>

        <p className="mb-8 text-gray-600">
          Python, Flask, React, TypeScript, and Tailwind CSS.
        </p>

        <Link
          to="/"
          className="inline-block rounded-xl bg-gray-900 px-6 py-3 text-white transition hover:bg-gray-700"
        >
          Back to Password Generator
        </Link>
      </section>
    </main>
  )
}
