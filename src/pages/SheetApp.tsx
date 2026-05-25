import Toolbar from '@/components/Toolbar'
import FormulaBar from '@/components/FormulaBar'
import Spreadsheet from '@/components/Spreadsheet'
import SheetTabs from '@/components/SheetTabs'
import StatusBar from '@/components/StatusBar'

export default function SheetApp() {
  return (
    <div className="flex flex-col h-full">
      <Toolbar />
      <FormulaBar />
      <Spreadsheet />
      <SheetTabs />
      <StatusBar />
    </div>
  )
}
