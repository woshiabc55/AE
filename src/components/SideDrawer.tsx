import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStellaris } from '@/store/useStellaris'
import { EXHIBITS } from '@/lib/exhibits'
import { Menu, X } from 'lucide-react'

export function SideDrawer() {
  const [open, setOpen] = useState(false)
  const active = useStellaris((s) => s.active)
  const setActive = useStellaris((s) => s.setActive)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-[101] flex h-10 w-10 items-center justify-center rounded-full bord-paper-15 backdrop-blur hover:bord-gilt-50 transition-colors duration-500"
        aria-label="展厅目录"
        data-cursor="hover"
      >
        <Menu className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="ovl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[200] bg-ink/70 backdrop-blur-sm"
            />
            <motion.aside
              key="drw"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="fixed left-0 top-0 z-[201] h-full w-[min(92vw,420px)] bg-ink border-r border-paper/10 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="font-mono text-[0.62rem] tracking-[0.3em] text-paper/50">
                    EXHIBITS
                  </p>
                  <p className="font-display text-xl mt-1">展厅目录</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 hover:bg-paper/5"
                  data-cursor="hover"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="gilt-line mx-6" />
              <nav className="flex-1 overflow-y-auto py-4">
                {EXHIBITS.map((e) => {
                  const isActive = e.id === active
                  return (
                    <button
                      key={e.id}
                      onClick={() => {
                        setActive(e.id)
                        setOpen(false)
                      }}
                      className={`group flex w-full items-center gap-4 px-6 py-3 text-left transition-colors duration-500 ${
                        isActive ? 'bg-paper/[0.04]' : 'hover:bg-paper/[0.02]'
                      }`}
                      data-cursor="hover"
                    >
                      <span
                        className={`font-mono text-[0.7rem] tracking-widest w-7 ${
                          isActive ? 'text-gilt' : 'text-paper/40'
                        }`}
                      >
                        {e.index}
                      </span>
                      <span
                        className={`flex-1 font-display text-base transition-all duration-500 ${
                          isActive ? 'text-gilt translate-x-1' : 'text-paper/80'
                        }`}
                      >
                        {e.title}
                      </span>
                      <span className="font-mono text-[0.6rem] tracking-widest text-paper/40">
                        {e.elementCount.toLocaleString('en')}
                      </span>
                    </button>
                  )
                })}
              </nav>
              <div className="px-6 py-5 text-paper-50 text-xs font-mono tracking-widest">
                ↑ / ↓ 切换 · 1-0 跳转 · R 回到序厅 · M 静音 · F 全屏
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
