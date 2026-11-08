export const ContentCard = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
}) => {
  return (
    <section
      aria-label="Blank panel"
      className="grid md:aspect-square w-full grid-rows-[auto_1fr] rounded-2xl border border-gray-200 bg-white p-7 shadow-lg"
    >
      <header>
        <p className="mb-1 text-sm font-medium uppercase tracking-widest text-gray-500">
          {subtitle}
        </p>
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>

      <div className="mt-2">{children}</div>
    </section>
  )
}
