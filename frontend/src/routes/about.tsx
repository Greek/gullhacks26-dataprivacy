import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
    component: About,
})

function About() {
    return (
        <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center p-6">
            <section className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">

                <h1 className="mb-4 text-3xl font-bold">
                    About Data Privacy Toolkit
                </h1>

                <p className="mb-6 text-gray-600">
                    Data Privacy Toolkit is a cybersecurity project developed
                    during GullHacks 2026. Our goal is to help users generate
                    more unpredictable passwords and promote better password
                    security practices.
                </p>

                <h2 className="mb-3 text-xl font-semibold">
                    Features
                </h2>

                <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-600">
                    <li>Random password generation</li>
                    <li>Random uppercase and lowercase letters</li>
                    <li>Optional special-character substitutions</li>
                    <li>Customizable password length</li>
                    <li>Python-based password generation</li>
                </ul>

                <h2 className="mb-3 text-xl font-semibold">
                    Technologies
                </h2>

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