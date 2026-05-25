import Toolbar from '@/components/Toolbar'
import FormulaBar from '@/components/FormulaBar'
import Spreadsheet from '@/components/Spreadsheet'
import SheetTabs from '@/components/SheetTabs'
import StatusBar from '@/components/StatusBar'

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#FAFAF5]">
      <header className="flex items-center px-4 py-2 bg-[#1B4332] text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#52B788] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="white" opacity="0.9" />
              <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.6" />
              <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.6" />
              <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.4" />
            </svg>
          </div>
          <h1 className="text-sm font-semibold tracking-wide">TabSheet</h1>
        </div>
        <div className="ml-auto text-xs text-[#b7e4c7] opacity-70">
          标签页工作表格
        </div>
      </header>
      <Toolbar />
      <FormulaBar />
      <Spreadsheet />
      <SheetTabs />
      <StatusBar />
    </div>
  )
}
