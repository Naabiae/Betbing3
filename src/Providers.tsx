import { PropsWithChildren, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import {
  initiaPrivyWalletConnector,
  injectStyles,
  InterwovenKitProvider,
  TESTNET,
} from '@initia/interwovenkit-react'
import InterwovenKitStyles from '@initia/interwovenkit-react/styles.js'

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
})

const queryClient = new QueryClient()

const LOCAL_MOVEGAME_CHAIN = {
  chain_id: 'movegame-1',
  chain_name: 'movegame',
  pretty_name: 'Movegame (Local)',
  network_type: 'devnet',
  bech32_prefix: 'init',
  fees: {
    fee_tokens: [{ denom: 'umin', fixed_min_gas_price: 0.015 }],
  },
  apis: {
    rpc: [{ address: 'http://localhost:26657' }],
    rest: [{ address: 'http://localhost:1317' }],
  },
} as any

export default function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    injectStyles(InterwovenKitStyles)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <InterwovenKitProvider
          {...TESTNET}
          defaultChainId={LOCAL_MOVEGAME_CHAIN.chain_id}
          customChain={LOCAL_MOVEGAME_CHAIN}
          enableAutoSign
        >
          {children}
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}

