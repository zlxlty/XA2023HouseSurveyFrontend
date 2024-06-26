import { useInView } from "framer-motion"
import { useEffect, useRef } from "react"

export default function useFetchMore(
  handleFetchMore: () => Promise<void>
) {
  const fetchMoreRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(fetchMoreRef)

  useEffect(() => {
    isInView && handleFetchMore()
  }, [isInView])

  return fetchMoreRef
}