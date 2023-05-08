import React from 'react'
import { WagmiConfig, WagmiConfigProps } from 'wagmi'
import { Provider, WebSocketProvider } from '@wagmi/core'

export function WagmiProvider<TProvider extends Provider, TWebSocketProvider extends WebSocketProvider>(
  props: React.PropsWithChildren<WagmiConfigProps<TProvider, TWebSocketProvider>>,
) {
  return (
    <WagmiConfig client={props.client}>
      {props.children}
    </WagmiConfig>
  )
}