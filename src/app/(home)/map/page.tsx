import { Metadata } from "next"
import { MapPage } from "./MapPage"

export const metadata: Metadata = {
  title: 'Mapa da FCT',
}

export default function Map() {
  return <MapPage />
}
