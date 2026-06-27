import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GalleryGrid from "@/components/Gallery/GalleryGrid";
import GalleryCard from "@/components/Gallery/GalleryCard";
import Sunflower from "@/svg/plants/Sunflower";
import Peashooter from "@/svg/plants/Peashooter";
import WallNut from "@/svg/plants/WallNut";
import BasicZombie from "@/svg/zombies/BasicZombie";
import ConeheadZombie from "@/svg/zombies/ConeheadZombie";
import BucketheadZombie from "@/svg/zombies/BucketheadZombie";
import Sun from "@/svg/ui/Sun";
import Pea from "@/svg/ui/Pea";
import Lawn from "@/svg/ui/Lawn";
import Background from "@/svg/scenes/Background";

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-200 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-lawn-700 px-4 py-2 font-bold text-white transition-transform hover:bg-lawn-600 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
            返回游戏
          </Link>
          <h1 className="font-pixel text-2xl text-lawn-900">图鉴 · Gallery</h1>
        </div>
        <div className="flex flex-col gap-10">
          <GalleryGrid title="植物">
            <GalleryCard title="向日葵" description="50 阳光，周期性产出额外阳光">
              <Sunflower width={80} height={90} />
            </GalleryCard>
            <GalleryCard title="豌豆射手" description="100 阳光，向前发射豌豆子弹">
              <Peashooter width={80} height={90} />
            </GalleryCard>
            <GalleryCard title="坚果墙" description="50 阳光，高血量阻挡僵尸前进">
              <WallNut width={76} height={84} />
            </GalleryCard>
          </GalleryGrid>
          <GalleryGrid title="僵尸">
            <GalleryCard title="普通僵尸" description="最常见的入侵者，血量与速度均衡">
              <BasicZombie width={70} height={88} />
            </GalleryCard>
            <GalleryCard title="路障僵尸" description="头戴橙色路障，血量更高">
              <ConeheadZombie width={70} height={96} />
            </GalleryCard>
            <GalleryCard title="铁桶僵尸" description="头顶铁桶，非常耐打">
              <BucketheadZombie width={70} height={100} />
            </GalleryCard>
            <GalleryCard title="受击状态" description="被豌豆命中时身体泛红闪烁">
              <BasicZombie width={70} height={88} isHit />
            </GalleryCard>
          </GalleryGrid>
          <GalleryGrid title="场景">
            <GalleryCard title="后院背景" description="天空、云朵、草地与房屋剪影">
              <Background width={220} height={120} />
            </GalleryCard>
            <GalleryCard title="草地格子" description="棋盘中的草地瓦片，交替深浅">
              <Lawn width={90} height={90} />
            </GalleryCard>
          </GalleryGrid>
          <GalleryGrid title="UI 元素">
            <GalleryCard title="阳光" description="点击收集，增加阳光资源">
              <Sun width={64} height={64} />
            </GalleryCard>
            <GalleryCard title="豌豆子弹" description="豌豆射手发射的飞行弹药">
              <Pea width={48} height={48} />
            </GalleryCard>
          </GalleryGrid>
        </div>
      </div>
    </div>
  );
}
