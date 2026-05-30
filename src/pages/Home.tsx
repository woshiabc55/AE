import MandelboxCanvas from '@/components/MandelboxCanvas'
import PosterOverlay from '@/components/PosterOverlay'

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
      <MandelboxCanvas />
      <PosterOverlay />
    </div>
  )
}
