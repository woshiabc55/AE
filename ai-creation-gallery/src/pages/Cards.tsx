import { Layers } from "lucide-react";
import { artworks } from "@/data/artworks";
import { useFilteredArtworks } from "@/hooks/useFilteredArtworks";
import { useGalleryFilters } from "@/hooks/useGalleryFilters";
import CardTile from "@/components/cards/CardTile";
import FilterSidebar from "@/components/filters/FilterSidebar";
import GalleryHeader from "@/components/common/GalleryHeader";
import EmptyState from "@/components/common/EmptyState";

export default function Cards() {
  const f = useGalleryFilters("card");
  const list = useFilteredArtworks(f.filters);
  const total = artworks.filter((a) => a.kind === "card").length;

  return (
    <div className="container py-10">
      <GalleryHeader
        eyebrow="Character Cards · 角色卡牌"
        icon={Layers}
        title="卡牌"
        highlight="馆"
        subtitle="稀有度分级、阵营归属、可翻转背刻的角色卡牌图鉴。悬浮卡牌感受立体倾斜与扫光，点击翻面阅读背刻。"
        count={total}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <FilterSidebar
            kind="card"
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 2xl:grid-cols-4">
              {list.map((a) => (
                <CardTile key={a.id} artwork={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
