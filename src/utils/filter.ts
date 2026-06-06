import type { DerivativeWork } from '../data/types';
import type { FilterState } from '../stores/app';

export function applyFilters(works: DerivativeWork[], f: FilterState): DerivativeWork[] {
  const q = f.query.trim().toLowerCase();
  let out = works;
  if (q) {
    out = out.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.ipName.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (f.types.length) out = out.filter((w) => f.types.includes(w.type));
  if (f.regions.length) out = out.filter((w) => f.regions.includes(w.region));
  if (f.ipIds.length) out = out.filter((w) => f.ipIds.includes(w.ipId));
  if (f.tags.length) out = out.filter((w) => f.tags.some((t) => w.tags.includes(t)));
  out = out.filter((w) => w.year >= f.yearRange[0] && w.year <= f.yearRange[1]);

  const sorted = [...out];
  sorted.sort((a, b) => {
    let v = 0;
    if (f.sort === 'year') v = a.year - b.year;
    else if (f.sort === 'popularity') v = a.popularity - b.popularity;
    else v = a.title.localeCompare(b.title, 'zh');
    return f.sortDesc ? -v : v;
  });
  return sorted;
}
