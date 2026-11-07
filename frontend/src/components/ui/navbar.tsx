import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu'
import { NavbarGroup } from './navbar-group'

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <NavbarGroup>
          <a
            href="/"
            className="text-lg font-semibold tracking-tight text-neutral-950 transition-colors hover:text-neutral-600 sm:text-xl"
          >
            Data Privacy Toolkit
          </a>
        </NavbarGroup>

        <NavigationMenu className="justify-end">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className="px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
              >
                Overview
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium text-neutral-600">
                Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[360px] gap-1 p-2 sm:grid-cols-2">
                  <ListItem href="/privacy-checklist" title="Privacy checklist">
                    Review common data privacy risks.
                  </ListItem>
                  <ListItem href="/data-scanner" title="Data scanner">
                    Find sensitive information in your data.
                  </ListItem>
                  <ListItem href="/data-requests" title="Data requests">
                    Manage access and deletion requests.
                  </ListItem>
                  <ListItem href="/policies" title="Policy center">
                    Create clear privacy policies.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/about"
                className="px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
              >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string; title: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        href={href}
        className="block rounded-md p-3 transition-colors hover:bg-neutral-100"
      >
        <div className="flex flex-col gap-1 text-sm">
          <div className="font-medium leading-none text-neutral-950">
            {title}
          </div>
          <div className="line-clamp-2 text-muted-foreground">{children}</div>
        </div>
      </NavigationMenuLink>
    </li>
  )
}
