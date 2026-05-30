export interface PromptSection {
  id: string;
  title: string;
  content: string;
}

export interface PromptScheme {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  fullPrompt: string;
  negativePrompt: string;
  sections: PromptSection[];
  previewImageUrl: string;
  params: {
    style: string;
    palette: string;
    composition: string;
    depth: string;
    text: string;
    decoration: string;
  };
}

const schemeAFullPrompt = `A high-resolution monochrome grayscale composite poster featuring a futuristic offline archive aesthetic rendered in architectural precision style. The central subject is a complex Mandelbox fractal cube structure exhibiting recursive cubic subdivisions at three to four visible recursion layers, creating a labyrinthine yet orderly spatial impression rendered in flat orthographic projection with a subtle isometric tilt, maintaining a clean organized display board aesthetic. The fractal surfaces are adorned with intricate blue and white porcelain Qinghua patterns including interlocking lotus scrolls, cloud collars, wave borders, peony sprays, and geometric key-fret borders. The blue pigment ranges from deep cobalt blue to pale sky blue applied in varying opacity to suggest underglaze painting technique, with the patterns conforming to the geometric planes of the fractal by wrapping around cubic faces, following edges, and scaling with the recursive subdivisions. Pattern density increases toward the center of each face and thins toward edges mimicking real porcelain brushwork distribution, while a subtle craquelure overlay at three to five percent opacity suggests aged glaze with a Voronoi-like network of fine cracks most visible on larger flat faces. The overall aesthetic is a post-digital preservation sensibility where the image feels like a recovered file from a defunct system or a museum catalog entry for a digital artifact. The color palette is predominantly monochrome grayscale with black, white, and twelve intermediate gray values, with the blue porcelain patterns as the sole chromatic exception. The grayscale range favors the lighter end at sixty-five to ninety percent brightness to maintain the light technical grid background requirement. Contrast is controlled and architectural with no harsh clipping or exaggerated HDR. The rendering style is flat, clean, and organized, evoking architectural presentation boards, museum specimen labels, and technical schematic sheets simultaneously. The composition follows a flat clean organized display board style structured as a layered interface collage with a clear central focus and flanking information zones using a twelve-column grid system with consistent margins where elements are arranged in deliberate alignment with every item having visual justification relative to the grid. Depth is created not through perspective but through layered paper textures, visible edges between overlapping layers, and soft drop shadows offset two to four pixels with blur of six to ten pixels and opacity of fifteen to twenty-five percent. The central sixty percent of the canvas width is dedicated to the Mandelbox fractal subject centered both horizontally and vertically occupying approximately fifty-five to sixty-five percent of the total canvas height. On the left flank a vertical information panel spans approximately fifteen percent of canvas width containing a title block reading ARCHIVE-0047 in eight-point monospace, metadata fields for date classification origin material and condition, a miniature wireframe schematic diagram, and a decorative QR-code-like pattern block. On the right flank a mirror-symmetric panel labeled SPECIMEN-QH-2024 contains technical parameters for recursion depth pattern type and glaze composition, a cross-section diagram of porcelain layer structure, and a decorative barcode-like pattern block. Slender icon toolbars with geometric icons run along both edges. Six to eight floating paper tags with short labels such as PATTERN-A, GLAZE-01, 蓝釉, 冰裂, 景德镇 are scattered around the fractal with slight rotations and soft shadows. Four to six UI fragments including a progress bar, toggle switch, radio buttons, and mini chart float at the periphery. Bold text 瓷器设计 appears in near-black at the upper-left of the central zone on a paper-strip background with expanded kerning. Bold text 青花瓷 appears in deep cobalt blue at the lower-right in a museum-label frame. Decorative corner brackets, dot clusters, and thin borders throughout. The background is a light technical grid on warm gray with crop marks, registration marks, and dimension lines. Subtle Chengdu theme with faint bamboo leaf watermark, 产地/ORIGIN: 蜀 metadata reference, warm-tinted grayscale, and tiny panda icon in toolbar. No human characters. No photographic elements. No colors beyond grayscale and cobalt blue. Clean organized display board style. Architectural render quality. 4K resolution.`;

const schemeBFullPrompt = `A high-resolution monochrome grayscale composite image in offline archive aesthetic with editorial magazine layout influence. The central subject is a Mandelbox fractal cube structure rendered in precise isometric view with five to six visible recursion layers creating an intensely detailed crystalline geometry. The fractal surfaces feature Qinghua blue and white porcelain patterns reinterpreted through a digital glitch lens — traditional lotus scrolls and wave borders are fragmented and displaced with horizontal scan-line interruptions, pixel-shift artifacts, and data-corruption overlays at eight to twelve percent opacity, creating a dialogue between ancient ceramic craft and digital entropy. The porcelain blue ranges from saturated indigo to electric cyan, more vivid and contemporary than traditional cobalt, with gradient fills within pattern segments suggesting screen-printed rather than hand-painted application. The overall aesthetic merges museum archival documentation with brutalist graphic design — raw, assertive, and deliberately imperfect. The color palette is monochrome grayscale with the porcelain blue as chromatic accent, but the grayscale leans cooler with blue-gray undertones, and includes deliberate tonal inversions where select background zones flip to dark gray or near-black creating dramatic contrast windows. The composition uses an asymmetric editorial spread layout — the fractal is positioned at the golden ratio point slightly left of center and elevated, with the right third of the canvas dedicated to a dense vertical text column in mixed Chinese and English set in condensed monospace type. The text column contains fragments of porcelain classification taxonomy, kiln temperature data, glaze chemistry formulas, and poetic descriptions of Qinghua technique, creating a reading experience alongside the visual. The left margin features a narrow vertical strip containing a continuous scroll of miniature porcelain pattern swatches — each a tiny rectangle showing a different traditional motif at thumbnail scale, arranged in a repeating grid that suggests a pattern library or specimen collection. Floating above the composition are three large semi-transparent geometric overlays — a circle, a triangle, and a square — each outlined in hairline cobalt blue at fifteen percent opacity, framing different zones of the fractal and creating a diagrammatic annotation layer. Bold text 瓷器设计 is set in ultra-condensed sans-serif at massive scale spanning the full canvas width behind the fractal at twenty percent opacity as a typographic ground layer. Bold text 青花瓷 appears in the text column as a pull-quote with a thick left border in cobalt blue and oversized opening quotation marks. The background combines the light technical grid with additional diagonal cross-hatching in select zones and large circled numbers referencing figure captions in an academic paper style. Paper textures are more pronounced with visible deckle edges on floating elements and a subtle coffee-ring stain watermark in one corner suggesting physical handling of the archive document. Decorative elements include dashed measurement lines with arrow endpoints, small crosshair targets at key compositional intersections, numbered callout dots connected to the fractal by thin leader lines, and a miniature coordinate axis indicator in the lower-left corner. The Chengdu influence appears as a faint topographic contour line pattern in the background evoking the Sichuan basin geography, a metadata field reading 蜀道 in the text column, and a subtle brocade weave texture overlaid on the pattern swatch strip. No human characters. No warm colors. No photographic elements. Brutalist editorial archive style. High-contrast controlled chaos. 4K resolution.`;

const schemeANegative = `human, person, face, figure, character, hand, silhouette, photograph, photo-realistic, gradient background, 3D perspective, lens flare, bokeh, depth of field, watermark, signature, warm colors, red, yellow, green, purple, orange, decorative font, script font, organic shapes, blob, splatter, noise artifacts, jpeg artifacts, low resolution, blurry, distorted text, misspelled text`;

const schemeBNegative = `human, person, face, figure, character, hand, silhouette, photograph, photo-realistic, smooth gradient, traditional perspective, lens flare, bokeh, watermark, signature, warm palette, red, yellow, green, orange, decorative serif font, organic natural shapes, watercolor, paint texture, low resolution, blurry, clean perfect surfaces, symmetrical layout, centered composition`;

export const schemes: PromptScheme[] = [
  {
    id: "a",
    name: "方案 A",
    subtitle: "离线档案·青花瓷 — 经典结构化",
    tag: "ARCHIVE-0047",
    fullPrompt: schemeAFullPrompt,
    negativePrompt: schemeANegative,
    previewImageUrl:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=" +
      encodeURIComponent(
        "A high-resolution monochrome grayscale composite poster, offline archive aesthetic, Mandelbox fractal cube with Qinghua blue and white porcelain patterns, lotus scrolls and wave borders in cobalt blue, layered interface collage with floating paper tags, technical grid background, bold text 瓷器设计 and 青花瓷, vertical information panels, icon toolbars, corner brackets and dots, architectural render style, no human characters"
      ) +
      "&image_size=landscape_16_9",
    sections: [
      {
        id: "subject",
        title: "核心主体",
        content:
          "Mandelbox分形立方体结构，3-4层递归细分，正交投影+微等轴测倾斜。表面覆以传统青花瓷纹饰——缠枝莲、云肩、海水江崖、折枝牡丹、回纹——钴蓝色从#1a3a6b至#a8c8e8，模拟釉下彩技法。纹饰随分形几何面包裹、沿边缘延伸、随递归缩放。3-5%冰裂纹覆层暗示古釉老化。",
      },
      {
        id: "style",
        title: "视觉风格",
        content:
          "离线档案美学——后数字保存感，如从废弃系统恢复的文件或数字文物的博物馆编目条目。单色灰阶为主（黑、白及12级中间灰），青花蓝为唯一彩色例外。灰阶偏亮端（65-90%亮度），对比度受控且建筑化。扁平、干净、有序的渲染风格，同时唤起建筑展板、博物馆标本标签和技术示意图纸。",
      },
      {
        id: "composition",
        title: "构图结构",
        content:
          "展板式分层拼贴，12栏网格系统。中央60%画布宽度为分形主体，左翼15%为信息面板（ARCHIVE-0047），右翼15%为镜像面板（SPECIMEN-QH-2024）。两侧边缘各3%为几何图标工具栏。深度通过纸质层叠纹理、可见边缘和柔和阴影创造，而非透视。",
      },
      {
        id: "floating",
        title: "浮动元素",
        content:
          "6-8个纸质标签（PATTERN-A、GLAZE-01、蓝釉、冰裂、景德镇等），±2-5°微旋转，柔和阴影。4-6个UI碎片（进度条、开关、单选按钮、迷你图表）位于外围70-85%不透明度。",
      },
      {
        id: "typography",
        title: "文字系统",
        content:
          "「瓷器设计」近黑色(#1a1a1a)，粗体无衬线CJK，位于中央区左上，纸条背景，扩展字距。「青花瓷」钴蓝色(#1a3a6b)，位于右下，博物馆标签框架。辅助文字为6-8pt等宽注释，中英混排。",
      },
      {
        id: "decoration",
        title: "装饰系统",
        content:
          "角括号（L形直角，非曲线）位于分形区四角、标签角、面板角。圆点作为视觉标点——列表项前圆点、网格对齐点、装饰性点群。细边框定义区域：画布0.5pt内边框、中央区虚线边框、标签实线边框、面板实线边框、UI碎片发丝线边框。",
      },
      {
        id: "depth",
        title: "深度与质感",
        content:
          "纸质层叠：白色底+1-3%噪点+水平纤维纹理+5%暖色调。重叠元素可见边缘，1px边缘线暗示物理厚度。柔和阴影：偏移(2px右,3px下)、模糊8px、不透明度18%、纯黑色。分形表面：光滑微反光釉面+微弱蓝白内发光+3-5%冰裂纹覆层。",
      },
      {
        id: "chengdu",
        title: "成都主题暗示",
        content:
          "微妙且氛围化，从不直白：右上角2%不透明度竹叶剪影水印，信息面板「产地/ORIGIN: 蜀」，浮动标签「蜀锦纹」，灰阶微暖色调（#f0eeeb而非#f0f0f0），右侧工具栏8px熊猫线描图标。",
      },
    ],
    params: {
      style: "离线档案 / 后数字保存",
      palette: "单色灰阶 + 钴蓝(#1a3a6b→#a8c8e8)唯一彩色",
      composition: "对称展板式 / 12栏网格 / 中央60%+侧翼15%×2",
      depth: "纸质层叠+可见边缘+柔和阴影（非透视）",
      text: "「瓷器设计」近黑左上 / 「青花瓷」钴蓝右下",
      decoration: "L形角括号+圆点群+细边框+裁切标记+配准标记",
    },
  },
  {
    id: "b",
    name: "方案 B",
    subtitle: "离线档案·青花瓷 — 编辑式解构",
    tag: "SPECIMEN-QH-2024",
    fullPrompt: schemeBFullPrompt,
    negativePrompt: schemeBNegative,
    previewImageUrl:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=" +
      encodeURIComponent(
        "A high-resolution monochrome grayscale composite image, offline archive aesthetic with editorial magazine layout, Mandelbox fractal cube with glitched Qinghua porcelain patterns, digital scan-line interruptions over lotus scrolls, asymmetric editorial spread, dense vertical text column, geometric overlay annotations, bold text 瓷器设计 as typographic ground layer, 青花瓷 as pull-quote, brutalist graphic design, no human characters"
      ) +
      "&image_size=landscape_16_9",
    sections: [
      {
        id: "subject",
        title: "核心主体",
        content:
          "Mandelbox分形立方体，精确等轴测视图，5-6层可见递归，创造极其精细的结晶几何。表面青花瓷纹饰经数字故障透镜重新诠释——传统缠枝莲和海水纹被水平扫描线中断、像素偏移伪影和数据损坏覆层（8-12%不透明度）碎片化和位移，在古陶瓷工艺与数字熵之间创造对话。",
      },
      {
        id: "style",
        title: "视觉风格",
        content:
          "博物馆档案文档与粗野主义平面设计的融合——原始、果断、刻意不完美。瓷蓝从饱和靛蓝到电光青，比传统钴蓝更鲜艳当代，纹饰段内渐变填充暗示丝网印刷而非手绘。灰阶偏冷带蓝灰底调，包含刻意色调反转——选定背景区翻转为深灰或近黑，创造戏剧性对比窗口。",
      },
      {
        id: "composition",
        title: "构图结构",
        content:
          "非对称编辑版面布局——分形位于黄金分割点略偏左且升高，右侧1/3画布为密集竖排文字列（中英混排浓缩等宽字体），包含瓷器分类学、窑温数据、釉料化学公式和青花技法诗意描述。左边缘窄竖条为连续微型瓷纹色板滚动条，暗示图案库或标本集。",
      },
      {
        id: "floating",
        title: "浮动元素",
        content:
          "三个大型半透明几何覆层——圆、三角、方形——各以发丝线钴蓝15%不透明度勾勒，框定分形不同区域，创造图解式注释层。纸质纹理更显著，浮动元素可见毛边，一角有微妙咖啡环水印暗示档案文件的物理接触。",
      },
      {
        id: "typography",
        title: "文字系统",
        content:
          "「瓷器设计」超浓缩无衬线，巨大尺度横跨全画布宽度，位于分形后方20%不透明度作为排版地基层。「青花瓷」在文字列中作为拉引语出现，粗左边框钴蓝色+超大开头引号。文字列本身是阅读体验与视觉体验的并行。",
      },
      {
        id: "decoration",
        title: "装饰系统",
        content:
          "虚线测量线+箭头端点，关键构图交叉处小十字准星目标，编号标注圆点通过细引导线连接分形，左下角微型坐标轴指示器。背景在技术网格基础上增加对角交叉影线区域和大学论文风格的大号带圈数字图注编号。",
      },
      {
        id: "depth",
        title: "深度与质感",
        content:
          "毛边纸质纹理更粗犷，咖啡环水印暗示物理使用痕迹。几何覆层创造图解式深度而非物理深度。色调反转区域创造戏剧性明暗对比。纹饰色板条带编织纹理覆层暗示蜀锦织物结构。",
      },
      {
        id: "chengdu",
        title: "成都主题暗示",
        content:
          "背景中微弱地形等高线图案暗示四川盆地地理，文字列中「蜀道」元数据字段，纹饰色板条上的微妙织锦纹理覆层。比方案A更地理化、更文本化的成都表达。",
      },
    ],
    params: {
      style: "粗野主义编辑 / 数字故障档案",
      palette: "冷灰阶+蓝灰底调+靛蓝→电光青+色调反转窗口",
      composition: "非对称编辑版面 / 黄金分割+右侧1/3文字列",
      depth: "几何覆层注释+毛边纸质+色调反转（非层叠阴影）",
      text: "「瓷器设计」超大20%地底层 / 「青花瓷」拉引语+引号",
      decoration: "虚线测量+十字准星+编号标注+坐标轴+带圈图注",
    },
  },
];

export function getSchemeById(id: string): PromptScheme | undefined {
  return schemes.find((s) => s.id === id);
}
