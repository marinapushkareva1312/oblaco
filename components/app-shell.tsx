import { cn } from "@/lib/utils"

type AppShellProps = {
  children: React.ReactNode
  className?: string
}

/**
 * Shared root container for every page. Keeps the header/nav bar
 * (MarketplaceHeader on the home page, DesktopNav everywhere else)
 * at the exact same width and top offset across the whole app.
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn("mx-auto min-h-screen max-w-md bg-background md:max-w-6xl", className)}>
      {children}
    </div>
  )
}
