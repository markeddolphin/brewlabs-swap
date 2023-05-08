import { parse, ParsedQs } from 'qs'
import { useMemo } from 'react'
import { useRouter } from 'next/router'

export default function useParsedQueryString(): ParsedQs {
  const router = useRouter()
  const search = router.asPath.slice(router.route.length)
  return useMemo(
    () => (search && search.length > 1 ? parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}),
    [search],
  )
}
