import { getCategoryStats } from '../data/memes';

const COLORS = ['hi', '', 'pink', 'green', '', 'hi', 'pink', '', 'green', 'hi'];

export default function StatsPanel() {
  const stats = getCategoryStats();
  return (
    <section className="panel">
      <h3>梗库雷达</h3>
      <div className="stats">
        {Object.entries(stats).map(([k, v], i) => (
          <div className="stat" key={k}>
            <div className="k">{k}</div>
            <div className={`v ${COLORS[i % COLORS.length]}`}>{v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
