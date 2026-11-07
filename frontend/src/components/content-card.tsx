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
    <div className="grid aspect-square grid-rows-[auto_1fr_auto] gap-6">
      <header>
        <p className="mb-1 text-sm font-medium uppercase tracking-widest text-gray-500">
          {subtitle}
        </p>
        <h1 className="text-3xl font-bold">{title}</h1>
      </header>

      <div className="grid grid-cols-1 gap-4 self-center">{children}</div>
    </div>
  )
}
