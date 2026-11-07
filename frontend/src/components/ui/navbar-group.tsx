import type React from "react"

export const NavbarGroup = ({ children }: { children?: React.ReactNode }) => {
  return <div className="flex gap-x-4 items-center">{children}</div>
}
