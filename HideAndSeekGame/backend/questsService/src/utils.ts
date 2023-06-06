// allow requests from localhost
export const TESTS_ENABLED = false

// We want all signatures to be "current". We consider "current" to be the current time,
// with a 10 minute tolerance to account for network delays and possibly unsynced clocks
export const VALID_SIGNATURE_TOLERANCE_INTERVAL_MS = 10 * 1000 * 60

// number of parcels to use as margin of error when comparing coordinates
export const MARGIN_OF_ERROR = 2

// reject any request from these IPs
export const denyListedIPS: string[] = []

export type Metadata = {
  origin?: string
  sceneId?: string
  parcel?: string
  tld?: string
  network?: string
  isGuest?: boolean
  realm: {
    domain?: string
    hostname?: string
    catalystName?: string
    layer?: string
    lighthouseVersion?: string
    serverName?: string
  }
}

export type PeerResponse = {
  ok: boolean
  peers: {
    id: string
    address: string
    lastPing: number
    parcel: [number, number]
    position: [number, number, number]
  }[]
}
