import { MARGIN_OF_ERROR, Metadata, PeerResponse } from '../utils'

// validate that the player is active in a catalyst server, and in the indicated coordinates, or within a margin of error
export async function checkPlayer(
  playerId: string,
  metadata: Metadata, // the realm domain where the player is right now, according to the incoming request
  playerCoordinatesFromRequest: number[]
) {
  let server = ''
  if ('domain' in metadata.realm) server = metadata.realm.domain
  if ('hostname' in metadata.realm) server = metadata.realm.hostname

  if (!server.includes('https://')) {
    server = `https://` + server
  }
  const url = server + '/comms/peers/'
  // const url = `https://peer.decentraland.org/comms/peers`

  try {
    const response = await fetch(url)
    const data: PeerResponse = await response.json()
    if (data.ok) {
      const player = data.peers.find((peer) => peer.address && peer.address.toLowerCase() === playerId.toLowerCase())
      if (!player.parcel) {
        return false
      }
      const playerCoordinatesFromDCLServers = player.parcel

      return player && checkCoords(playerCoordinatesFromDCLServers, [playerCoordinatesFromRequest])
    }
  } catch (error) {
    console.log(error)
    return false
  }

  return false
}

// check coordinates against multiple target parcels. - within a margin of error
export function checkCoords(coords: number[], targetParcels: number[][]) {
  targetParcels.forEach((targetParcel) => {
    if (
      Math.abs(coords[0] - targetParcel[0]) <= MARGIN_OF_ERROR &&
      Math.abs(coords[1] - targetParcel[1]) <= MARGIN_OF_ERROR
    )
      return true
  })
  return false
}
