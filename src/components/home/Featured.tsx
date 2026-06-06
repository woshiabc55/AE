import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card, CardGrid } from '../library/CardGrid'
import type { Derivative } from '../../data/derivatives'

interface FeaturedProps {
  items: Derivative[]
  title: string
  hint?: string
}

export function Featured({ items, title, hint }: FeaturedProps) {
  return (
    <section className="border-b border-bone/10">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="pixel-h text-xl glow-text">{title}</h2>
          {hint && <span className="label-pixel opacity-70">{hint}</span>}
        </div>
        <CardGrid items={items.slice(0, 8)} compact />
      </div>
    </section>
  )
}
