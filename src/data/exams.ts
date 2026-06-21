import type { ExamPaper } from "./types";

// 高数试卷档案 - Mock 数据
export const examPapers: ExamPaper[] = [
  {
    id: "exam-2024-final",
    title: "高等数学（上）期末考试",
    course: "高等数学 A",
    semester: "2024-2025 学年 第一学期",
    year: 2024,
    duration: 120,
    totalScore: 100,
    difficulty: "medium",
    setter: "高等数学教研室",
    notes: [
      "本试卷共 4 页，请核对页数后再作答。",
      "请将答案写在答题纸相应位置，写在试题卷上无效。",
      "考试结束时，请将试题卷与答题纸一并交回。",
    ],
    sections: [
      {
        title: "一、选择题",
        type: "choice",
        instruction: "本大题共 5 小题，每小题 4 分，共 20 分。在每小题给出的四个选项中，只有一项是符合题目要求的。",
        questions: [
          {
            id: "q1",
            number: 1,
            content: "当 x → 0 时，变量 (1/x) sin x 是",
            score: 4,
            options: [
              "无穷大量",
              "无穷小量",
              "有界变量但不是无穷小量",
              "无界变量但不是无穷大量",
            ],
          },
          {
            id: "q2",
            number: 2,
            content: "设 f(x) 在 x = 0 处可导，且 f(0) = 0，则 lim(x→0) [f(sin 2x) / x] 等于",
            score: 4,
            options: ["f'(0)", "2 f'(0)", "f'(0) / 2", "0"],
          },
          {
            id: "q3",
            number: 3,
            content: "函数 f(x) = x³ - 3x + 1 在区间 [-2, 2] 上的最大值为",
            score: 4,
            options: ["1", "3", "5", "9"],
          },
          {
            id: "q4",
            number: 4,
            content: "设 ∫ f(x) dx = x² + C，则 ∫ x f(x²) dx 等于",
            score: 4,
            options: ["x⁴/2 + C", "x⁴/4 + C", "x⁴ + C", "2x⁴ + C"],
          },
          {
            id: "q5",
            number: 5,
            content: "广义积分 ∫₁^{+∞} (1/x²) dx 的值为",
            score: 4,
            options: ["1", "1/2", "+∞", "0"],
          },
        ],
      },
      {
        title: "二、填空题",
        type: "fill",
        instruction: "本大题共 5 小题，每小题 4 分，共 20 分。把答案填在题中横线上。",
        questions: [
          {
            id: "q6",
            number: 6,
            content: "lim(x→0) (e^x - 1 - x) / x² = ________。",
            score: 4,
          },
          {
            id: "q7",
            number: 7,
            content: "设 y = ln(1 + x²)，则 dy = ________。",
            score: 4,
          },
          {
            id: "q8",
            number: 8,
            content: "曲线 y = x⁴ - 2x² + 3 的拐点个数为 ________。",
            score: 4,
          },
          {
            id: "q9",
            number: 9,
            content: "∫₀^{π/2} sin²x dx = ________。",
            score: 4,
          },
          {
            id: "q10",
            number: 10,
            content: "设 f(x) 连续，且 ∫₀^x f(t) dt = x²(1 + x)，则 f(2) = ________。",
            score: 4,
          },
        ],
      },
      {
        title: "三、计算题",
        type: "compute",
        instruction: "本大题共 4 小题，每小题 10 分，共 40 分。解答应写出文字说明、证明过程或演算步骤。",
        questions: [
          {
            id: "q11",
            number: 11,
            content:
              "求极限 lim(x→0⁺) (ln x / ln(e^x - 1))。",
            score: 10,
          },
          {
            id: "q12",
            number: 12,
            content:
              "设函数 y = y(x) 由方程 e^y + x y = e 所确定，求 y'(0) 及 y″(0)。",
            score: 10,
          },
          {
            id: "q13",
            number: 13,
            content:
              "计算不定积分 ∫ (x e^x) / (1 + x)² dx。",
            score: 10,
          },
          {
            id: "q14",
            number: 14,
            content:
              "设平面图形由曲线 y = x² 与 y = 2x 所围成，求该图形的面积，并求其绕 x 轴旋转所得旋转体的体积。",
            score: 10,
          },
        ],
      },
      {
        title: "四、证明题",
        type: "proof",
        instruction: "本大题共 2 小题，每小题 10 分，共 20 分。证明要求逻辑严密、步骤完整。",
        questions: [
          {
            id: "q15",
            number: 15,
            content:
              "设 f(x) 在 [0, +∞) 上连续，且 f(x) > 0。证明：函数 F(x) = ∫₀^x f(t) dt - ∫₀^x [1/f(t)] dt 在 (0, +∞) 内有且仅有一个零点。",
            score: 10,
          },
          {
            id: "q16",
            number: 16,
            content:
              "设 f(x) 在 [a, b] 上连续，在 (a, b) 内可导，且 f(a) = f(b) = 0。证明：存在 ξ ∈ (a, b)，使得 f'(ξ) + f(ξ) = 0。",
            score: 10,
          },
        ],
      },
    ],
  },
  {
    id: "exam-2023-mid",
    title: "高等数学（上）期中考试",
    course: "高等数学 A",
    semester: "2023-2024 学年 第一学期",
    year: 2023,
    duration: 90,
    totalScore: 100,
    difficulty: "easy",
    setter: "高等数学教研室",
    notes: [
      "本试卷共 3 页，满分 100 分。",
      "请使用黑色钢笔或签字笔作答。",
      "允许使用不具编程功能的计算器。",
    ],
    sections: [
      {
        title: "一、选择题",
        type: "choice",
        instruction: "本大题共 6 小题，每小题 4 分，共 24 分。",
        questions: [
          {
            id: "m-q1",
            number: 1,
            content: "函数 y = √(4 - x²) 的定义域为",
            score: 4,
            options: ["[-2, 2]", "(-2, 2)", "(-∞, 2]", "[-2, +∞)"],
          },
          {
            id: "m-q2",
            number: 2,
            content: "lim(x→∞) (1 + 2/x)^x =",
            score: 4,
            options: ["e", "e²", "1", "∞"],
          },
          {
            id: "m-q3",
            number: 3,
            content: "设 f(x) = |x|，则 f(x) 在 x = 0 处",
            score: 4,
            options: ["不连续", "连续但不可导", "可导且 f'(0) = 0", "可导且 f'(0) = 1"],
          },
          {
            id: "m-q4",
            number: 4,
            content: "函数 y = sin x 在 [0, π] 上的平均值为",
            score: 4,
            options: ["1/2", "2/π", "1/π", "π/2"],
          },
          {
            id: "m-q5",
            number: 5,
            content: "曲线 y = 1/x 在点 (1, 1) 处的切线方程为",
            score: 4,
            options: ["x + y = 2", "x - y = 0", "y = -x + 2", "y = x"],
          },
          {
            id: "m-q6",
            number: 6,
            content: "∫ (1/(1 + x²)) dx =",
            score: 4,
            options: ["arctan x + C", "ln(1 + x²) + C", "arcsin x + C", "tan x + C"],
          },
        ],
      },
      {
        title: "二、计算题",
        type: "compute",
        instruction: "本大题共 5 小题，每小题 12 分，共 60 分。",
        questions: [
          {
            id: "m-q7",
            number: 7,
            content: "求 lim(x→0) (tan x - sin x) / x³。",
            score: 12,
          },
          {
            id: "m-q8",
            number: 8,
            content: "设 y = (sin x)^{ln x}，求 dy/dx。",
            score: 12,
          },
          {
            id: "m-q9",
            number: 9,
            content: "求 ∫ x² √(1 + x³) dx。",
            score: 12,
          },
          {
            id: "m-q10",
            number: 10,
            content: "求函数 f(x) = x³ - 3x² + 2 的极值。",
            score: 12,
          },
          {
            id: "m-q11",
            number: 11,
            content: "计算 ∫₀^{ln 2} (e^x / (e^{2x} + 1)) dx。",
            score: 12,
          },
        ],
      },
      {
        title: "三、应用与证明",
        type: "proof",
        instruction: "本大题共 1 小题，共 16 分。",
        questions: [
          {
            id: "m-q12",
            number: 12,
            content:
              "设某工厂生产 x 件产品的总成本为 C(x) = 1000 + 50x - 0.1x² + 0.001x³（元）。求：(1) 边际成本函数；(2) 平均成本最小时的产量；(3) 证明当产量为 100 件时，平均成本取得极小值。",
            score: 16,
          },
        ],
      },
    ],
  },
  {
    id: "exam-2024-final-b",
    title: "高等数学（下）期末考试",
    course: "高等数学 A",
    semester: "2023-2024 学年 第二学期",
    year: 2024,
    duration: 120,
    totalScore: 100,
    difficulty: "hard",
    setter: "高等数学教研室",
    notes: [
      "本试卷涵盖多元微积分与级数内容。",
      "请仔细审题，合理分配作答时间。",
    ],
    sections: [
      {
        title: "一、选择题",
        type: "choice",
        instruction: "本大题共 5 小题，每小题 4 分，共 20 分。",
        questions: [
          {
            id: "b-q1",
            number: 1,
            content: "函数 z = ln(x² + y² - 1) 的定义域为",
            score: 4,
            options: [
              "x² + y² > 1",
              "x² + y² ≥ 1",
              "x² + y² < 1",
              "x² + y² ≤ 1",
            ],
          },
          {
            id: "b-q2",
            number: 2,
            content: "设 z = e^{xy}，则 ∂z/∂x 等于",
            score: 4,
            options: ["y e^{xy}", "x e^{xy}", "e^{xy}", "xy e^{xy}"],
          },
          {
            id: "b-q3",
            number: 3,
            content: "级数 ∑ (1/n²) 的和为",
            score: 4,
            options: ["π²/6", "π/4", "1", "+∞"],
          },
          {
            id: "b-q4",
            number: 4,
            content: "幂级数 ∑ (x^n / n!) 的收敛域为",
            score: 4,
            options: ["(-1, 1)", "[-1, 1]", "(-∞, +∞)", "(-1, 1]"],
          },
          {
            id: "b-q5",
            number: 5,
            content: "设 D 由 y = x² 与 y = x 所围成，则 ∬_D dxdy =",
            score: 4,
            options: ["1/6", "1/3", "1/2", "1"],
          },
        ],
      },
      {
        title: "二、计算题",
        type: "compute",
        instruction: "本大题共 5 小题，每小题 12 分，共 60 分。",
        questions: [
          {
            id: "b-q6",
            number: 6,
            content: "设 z = f(x² - y², e^{xy})，其中 f 具有二阶连续偏导数，求 ∂z/∂x 与 ∂²z/∂x∂y。",
            score: 12,
          },
          {
            id: "b-q7",
            number: 7,
            content: "计算二重积分 ∬_D (x + y) dxdy，其中 D 由直线 x = 0, y = 0 及 x + y = 1 所围成。",
            score: 12,
          },
          {
            id: "b-q8",
            number: 8,
            content: "判别级数 ∑_{n=1}^{∞} ((-1)^n · n) / (n² + 1) 的敛散性；若收敛，指出是绝对收敛还是条件收敛。",
            score: 12,
          },
          {
            id: "b-q9",
            number: 9,
            content: "将函数 f(x) = 1/(2 - x) 展开为 (x - 1) 的幂级数，并指出收敛域。",
            score: 12,
          },
          {
            id: "b-q10",
            number: 10,
            content: "计算曲线积分 ∮_L (2x y) dx + (x² + y) dy，其中 L 为圆周 x² + y² = 1 取逆时针方向。",
            score: 12,
          },
        ],
      },
      {
        title: "三、综合题",
        type: "proof",
        instruction: "本大题共 2 小题，每小题 10 分，共 20 分。",
        questions: [
          {
            id: "b-q11",
            number: 11,
            content:
              "在半径为 R 的半球内嵌入一个长方体，使其顶点均在半球面上，求该长方体体积的最大值。",
            score: 10,
          },
          {
            id: "b-q12",
            number: 12,
            content:
              "证明：方程 ∫₀^x e^{-t²} dt = x/2 在 (0, 1) 内有且仅有一个实根。",
            score: 10,
          },
        ],
      },
    ],
  },
];

export function getExamById(id: string): ExamPaper | undefined {
  return examPapers.find((e) => e.id === id);
}
