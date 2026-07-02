import { Mountain } from "lucide-react";
import { artworks } from "@/data/artworks";
import { useFilteredArtworks } from "@/hooks/useFilteredArtworks";
import { useGalleryFilters } from "@/hooks/useGalleryFilters";
import SceneMasonry from "@/components/scenes/SceneMasonry";
import FilterSidebar from "@/components/filters/FilterSidebar";
import GalleryHeader from "@/components/common/GalleryHeader";
import EmptyState from "@/components/common/EmptyState";

export default function Scenes() {
  const f = useGalleryFilters("scene");
  const list = useFilteredArtworks(f.filters);
  const total = artworks.filter((a) => a.kind === "scene").length;

  return (
    <div className="container py-10">
      <GalleryHeader
        eyebrow="Scene Wallpapers · 场景壁纸"
        icon={Mountain}
        title="场景"
        highlight="馆"
        subtitle="氛围各异的沉浸式 AI 场景，瀑布流错落排布。点击放大图标进入全屏沉浸浏览，方向键切换。"
        count={total}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <FilterSidebar
            kind="scene"
            rarities={f.rarities}
            toggleRarity={f.toggleRarity}
            groups={f.groups}
            toggleGroup={f.toggleGroup}
            tags={f.tags}
            toggleTag={f.toggleTag}
            sort={f.sort}
            setSort={f.setSort}
            reset={f.reset}
            activeCount={f.activeCount}
            resultCount={list.length}
          />
        </aside>

        <div>
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <SceneMasonry items={list} />
          )}
        </div>
      </div>
    </div>
  );
}
