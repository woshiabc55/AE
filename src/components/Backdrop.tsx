import GridLayer from "./GridLayer";
import StripeLayer from "./StripeLayer";
import LightRays from "./LightRays";
import Particles from "./Particles";

/**
 * 背景层容器：按 z-index 顺序从下到上叠加
 * 0: LightRays 体积光 / 扫描 / 暗角 / 噪点
 * 1: Particles 粒子
 * 2: GridLayer 网格地板
 * 3: StripeLayer 条纹
 * 4: LightRays 体积光
 */
export default function Backdrop() {
  return (
    <>
      <Particles />
      <GridLayer />
      <StripeLayer />
      <LightRays />
    </>
  );
}
