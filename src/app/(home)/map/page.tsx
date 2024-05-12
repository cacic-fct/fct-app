import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Mapa da FCT',
}

export default function Map() {
  return (
    <>
      <iframe 
        style={{border: 'none'}}
        width="100%" 
        height="100%" 
        src="https://www.openstreetmap.org/export/embed.html?bbox=-51.40863429218204%2C-22.121644940237708%2C-51.406579720076635%2C-22.120173953427848&amplayer=mapnik">
      </iframe>
    </>
  )
}
