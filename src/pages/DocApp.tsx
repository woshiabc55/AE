import DocToolbar from '@/components/doc/DocToolbar'
import DocEditor from '@/components/doc/DocEditor'

export default function DocApp() {
  return (
    <div className="flex flex-col h-full">
      <DocToolbar />
      <DocEditor />
    </div>
  )
}
