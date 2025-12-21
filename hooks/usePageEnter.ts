import { useEffect, useState } from "react"

interface PageEnterState {
  hydrated: boolean
  entered: boolean
}

/**
 * Small landing-page helper to coordinate hydration and reveal timing.
 * Avoids wagmi flashes and gives a tiny delay before animations start.
 */
export function usePageEnter(delay = 160): PageEnterState {
  const [hydrated, setHydrated] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    setHydrated(true)

    const timer = window.setTimeout(() => {
      setEntered(true)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [delay])

  return { hydrated, entered }
}
