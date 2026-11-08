import { Link } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './navigation-menu'

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        <div aria-hidden="true" />

        <Link
          to="/"
          className="text-center text-base font-semibold tracking-tight text-neutral-950 transition-colors hover:text-neutral-600 sm:text-xl"
        >
          Secure &amp; Memorable Password Generator
        </Link>

        <NavigationMenu className="justify-self-end">
          <NavigationMenuList>
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
