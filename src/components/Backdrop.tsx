import GridLayer from "./GridLayer";
import StripeLayer from "./StripeLayer";
import LightRays from "./LightRays";
import Particles from "./Particles";
import PixelFlow from "./PixelFlow";
import MathCurve from "./MathCurve";

/**
 * 背景层容器：按 z-index 顺序从下到上叠加
 * 1: PixelFlow 迷幻像素流动（最低层）
 * 2: MathCurve 数学曲线（sin/cos）
 * 3: LightRays 体积光 / 扫描 / 暗角 / 噪点
 * 4: Particles 粒子
 * 5: GridLayer 网格地板
 * 6: StripeLayer 条纹
 */
export default function Backdrop() {
  return (
    <>
      <PixelFlow />
      <MathCurve />
      <Particles />
      <GridLayer />
      <StripeLayer />
      <LightRays />
    </>
  );
}
