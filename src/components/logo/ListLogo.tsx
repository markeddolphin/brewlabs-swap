import React from 'react'
import useHttpLocations from '../../hooks/useHttpLocations'
import Logo from './Logo'

export default function ListLogo({
  logoURI,
  style,
  size = '24px',
  alt,
}: {
  logoURI: string
  size?: string
  style?: React.CSSProperties
  alt?: string
}) {
  const srcs: string[] = useHttpLocations(logoURI)

  return <Logo width={size} height={size} alt={alt} srcs={srcs} style={style} />
}
