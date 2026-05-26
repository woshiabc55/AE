import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import DataStorage from '@/components/DataStorage'

export default function Home() {
  const [activeItem, setActiveItem] = useState('data-storage')

  const renderContent = () => {
    switch (activeItem) {
      case 'data-storage':
        return <DataStorage />
      default:
        return (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#8888a0]">此窗格为空</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0d1a]">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-3xl">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
