import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  Heart,
  Pen,
  Eye,
  EyeOff,
  Film,
  Tag as TagIcon,
  Share2,
  History,
  Wand2,
  GitBranch,
  Star,
  MessageSquare,
} from "lucide-react";
import { useAppStore } from "@/store";
import { renderPrompt, estimateTokens } from "@/utils/prompt";
import { copyText, formatTime, timeAgo } from "@/utils/format";
import { BEAT_MODEL_LABEL, GENRE_LABEL } from "@/data/seed";
import { FieldEditor } from "@/components/FieldEditor";
import { PromptPreview } from "@/components/PromptPreview";
import { ShareModal } from "@/components/marketplace/ShareModal";
import { CommentSection } from "@/components/marketplace/CommentSection";
import { RatingSection } from "@/components/marketplace/RatingSection";
import { PromptOptimizer } from "@/components/prompt/PromptOptimizer";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { toast } from "@/store/toast";
import { Skeleton } from "@/components/ui/Skeleton";

export function ScriptView() {
  const { id } = useParams();
  const nav = useNavigate();
  const tpl = useAppStore((s) => s.templates.find((t) => t.id === id));
  const isFav = useAppStore((s) => s.isFavorite);
  const toggleFav = useAppStore((s) => s.toggleFavorite);
  const incrementUsage = useAppStore((s) => s.incrementUsage);
  const duplicate = useAppStore((s) => s.duplicateTemplate);

  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [optimizeOpen, setOptimizeOpen] = useState(false);
  const [tplOverride, setTplOverride] = useState<any | null>(null);

  // 实时版本数
  const versionCount = useLiveQuery(
    () => db.versions.where("templateId").equals(id ?? "").count(),
    [id]
  );

  useEffect(() => {
    if (tpl) {
      const init: Record<string, string> = {};
      tpl.fields.forEach((f) => (init[f.key] = defaultExample(f.key, f.type)));
      setValues(init);
      incrementUsage(tpl.id);
      localStorage.setItem("lumiere.lastTemplateId", tpl.id);
    }
  }, [tpl?.id]);

  if (!tpl) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Film size={36} className="text-ink-500 mx-auto mb-3" />
        <h1 className="font-display text-[32px] text-paper-50">剧本不存在</h1>
        <p className="mt-2 font-serif text-ink-300">该模板可能已被删除。</p>
        <Link to="/library" className="reel-button mt-6 inline-flex">
          <ArrowLeft size={11} /> 返回模板库
        </Link>
      </div>
    );
  }

  // 优化器可能已应用了重写，临时覆盖展示
  const displayTpl = tplOverride
    ? { ...tpl, ...tplOverride }
    : tpl;

  const rendered = renderPrompt(displayTpl.promptTpl, values);
  const tokens = estimateTokens(rendered + displayTpl.systemPrompt);
  const filled = displayTpl.fields.filter((f) => values[f.key]?.trim()).length;
  const fav = isFav(displayTpl.id);

  const onCopy = async (text: string, key: string) => {
    await copyText(text);
    setCopied(key);
    toast.success("已复制", text.length > 60 ? `${text.slice(0, 60)}…` : undefined);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mx-auto max-w-[1480px] px-6 lg:px-10 py-8">
      {/* 顶部导航条 */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <button onClick={() => nav(-1)} className="ghost-button text-[10px] py-1.5 px-3">
          <ArrowLeft size={11} /> 返回
        </button>
        <span className="scene-tag">SCENE 02 / SCRIPT VIEW</span>
        <span className="ml-auto label-overline flex items-center gap-2">
          <Eye size={11} /> {tpl.usageCount.toLocaleString()} 次调用
        </span>
        {versionCount !== undefined && versionCount > 0 && (
          <Link
            to={`/library/${tpl.id}/versions`}
            className="ghost-button text-[10px] py-1.5 px-3"
          >
            <History size={11} /> {versionCount} 个版本
          </Link>
        )}
      </div>

      {/* Header */}
      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="scene-tag">{BEAT_MODEL_LABEL[tpl.beatModel]}</span>
            <span className="scene-tag border-paper-300 text-paper-200">
              {GENRE_LABEL[tpl.genre]}
            </span>
            <span className="label-overline">v{tpl.version.toString().padStart(2, "0")}</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest2 border ${
                tpl.isPublic
                  ? "border-amber text-amber"
                  : "border-ink-500 text-ink-300"
              }`}
            >
              {tpl.isPublic ? "Public" : "Private"}
            </span>
          </div>
          <h1 className="font-display text-[56px] md:text-[72px] leading-[0.95] text-paper-50">
            {tpl.title}
          </h1>
          <p className="mt-5 font-serif italic text-[20px] text-paper-200 leading-[1.5] border-l-2 border-amber pl-4 max-w-2xl">
            "{tpl.logline}"
          </p>
          <p className="mt-4 font-serif text-[15px] text-paper-200 leading-[1.8] max-w-2xl">
            {tpl.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {tpl.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest2 text-ink-200 border border-ink-600"
              >
                <TagIcon size={9} className="inline mr-1" /> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="panel p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="label-overline">By</span>
              <span className="font-mono text-[12px] text-paper-100">{tpl.authorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="label-overline">Updated</span>
              <span className="font-mono text-[12px] text-paper-100">{formatTime(tpl.updatedAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="label-overline">Created</span>
              <span className="font-mono text-[12px] text-paper-100">{timeAgo(tpl.createdAt)}</span>
            </div>
            <div className="pt-3 border-t border-ink-700 grid grid-cols-2 gap-2">
              <Link to={`/studio/${tpl.id}`} className="reel-button text-[10px] py-2">
                <Pen size={11} /> 派生副本
              </Link>
              <button
                onClick={() => toggleFav(tpl.id)}
                className={`ghost-button text-[10px] py-2 ${
                  fav ? "!border-reel !text-reel" : ""
                }`}
              >
                <Heart size={11} fill={fav ? "#C8102E" : "none"} /> {fav ? "已收藏" : "收藏"}
              </button>
            </div>
            <button
              onClick={() => setShareOpen(true)}
              className="ghost-button text-[10px] py-2 w-full"
            >
              <Share2 size={11} /> 分享
            </button>
            <button
              onClick={() => setOptimizeOpen(true)}
              className="ghost-button text-[10px] py-2 w-full"
            >
              <Wand2 size={11} /> AI 优化提示词
            </button>
            <button
              onClick={async () => {
                const dup = await duplicate(tpl.id);
                if (dup) {
                  toast.success("已派生", `「${dup.title}」已创建`);
                  nav(`/studio/${dup.id}`);
                }
              }}
              className="ghost-button text-[10px] py-2 w-full"
            >
              <GitBranch size={11} /> 派生为我的草稿
            </button>
          </div>
        </div>
      </div>

      {/* 主体三栏：阅读视图 / 字段 / 提示词 */}
      <div className="grid lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 panel p-8">
          <div className="flex items-center justify-between mb-6 border-b border-ink-700 pb-3">
            <div className="flex items-center gap-2">
              <span className="scene-tag">SCENE 01 · 剧本结构</span>
            </div>
            <button
              onClick={() => setShowRaw((s) => !s)}
              className="ghost-button text-[10px] py-1 px-2.5"
            >
              {showRaw ? <EyeOff size={11} /> : <Eye size={11} />}
              {showRaw ? "纯提示词" : "字段填写"}
            </button>
          </div>

          {showRaw ? (
            <article className="line-numbers max-w-[720px] mx-auto font-serif text-[16px] leading-[2] text-paper-100">
              <h2 className="font-display text-[28px] text-paper-50 mb-1">
                {tpl.title}
              </h2>
              <p className="text-ink-300 italic mb-6">— by {tpl.authorName}</p>

              <h3 className="text-amber text-[18px] font-display mt-8 mb-2">LOGLINE</h3>
              <p className="italic">{tpl.logline || "（未提供）"}</p>

              {tpl.fields.map((f) => {
                const v = values[f.key];
                if (!v) return null;
                return (
                  <div key={f.key} className="mt-6">
                    <h3 className="text-amber text-[16px] font-display mb-1">
                      ▸ {f.label.toUpperCase()}
                    </h3>
                    {f.type === "list" ? (
                      tryParseList(v).map((it: string, i: number) => (
                        <p key={i}>
                          <span className="text-ink-400 mr-2">
                            {String(i + 1).padStart(2, "0")}.
                          </span>
                          {it}
                        </p>
                      ))
                    ) : f.type === "struct" ? (
                      v.split("\n").map((line, i) => (
                        <p key={i}>
                          {line.includes("：") ? (
                            <>
                              <span className="text-paper-300">
                                {line.split("：")[0]}：
                              </span>
                              <span>{line.split("：").slice(1).join("：")}</span>
                            </>
                          ) : (
                            line
                          )}
                        </p>
                      ))
                    ) : (
                      <p>{v}</p>
                    )}
                  </div>
                );
              })}

              <p className="mt-12 text-center text-amber font-display italic">
                ❲ FIN · TAKE 01 ❳
              </p>
            </article>
          ) : (
            <div className="space-y-7">
              {tpl.fields.map((f) => (
                <FieldEditor
                  key={f.key}
                  field={f}
                  value={values[f.key] ?? ""}
                  onChange={(v) => setValues((p) => ({ ...p, [f.key]: v }))}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="scene-tag">PROMPT</span>
            <span className="label-overline">
              {filled}/{tpl.fields.length} 已填写 · ≈ {tokens} tok
            </span>
          </div>
          <PromptPreview
            tpl={displayTpl.promptTpl}
            systemPrompt={displayTpl.systemPrompt}
            values={values}
            onValuesChange={setValues}
          />
          <Link
            to={`/studio/${tpl.id}`}
            className="reel-button w-full justify-center"
          >
            <Pen size={12} /> 进入 Studio 编辑
          </Link>
        </aside>
      </div>

      {/* 评论 / 评分 */}
      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CommentSection templateId={tpl.id} />
        </div>
        <div>
          <RatingSection templateId={tpl.id} />
        </div>
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} tpl={tpl} />
      <PromptOptimizer
        open={optimizeOpen}
        onClose={() => setOptimizeOpen(false)}
        tpl={tpl}
        values={values}
        onApply={(patch) => {
          // 优化器应用时跳转到 Studio
          const newTitle = `${tpl.title} · 优化版`;
          toast.info("已跳转到 Studio", "请在 Studio 中点击「保存为版本」");
          // 简单做法：直接跳 Studio，使用 URL hash 携带 patch
          const hash = btoa(unescape(encodeURIComponent(JSON.stringify(patch))));
          nav(`/studio/${tpl.id}?opt=${encodeURIComponent(hash)}`);
        }}
      />
    </div>
  );
}

function tryParseList(v: string): string[] {
  try {
    const p = JSON.parse(v);
    if (Array.isArray(p)) return p.filter(Boolean);
  } catch {
    /* */
  }
  return v.split("\n").filter(Boolean);
}

function defaultExample(key: string, type: string): string {
  const samples: Record<string, string> = {
    title: "《回声巷》",
    logline:
      "当一个失忆的女摄影师返回故乡小镇，企图拼凑童年真相，却撞见仍在等待她归来的「假母亲」。",
    world:
      "1990s 的江南小镇，雨季绵延。青石板路永远潮湿，晾衣绳穿过巷道把天空切成一条一条。",
    protagonist:
      "姓名：苏念\n年龄：32\n外在：圆框眼镜、左手腕旧疤、总穿米色风衣\n内在：强迫症、过度共情、习惯用快门代替说话\n欲望：找回童年记忆\n伤口：八岁那年目睹母亲「消失」\n弧光：从「我必须记得」到「我可以选择记得」",
    antagonist:
      "「假母亲」周姨：温和、掌握镇上所有秘密，代表苏念无法接受的家庭真相。",
    beats: JSON.stringify([
      "开场 · 苏念拖着行李箱回到小巷，雨声与童谣",
      "触发 · 老屋门口放着一双童鞋，尺寸是苏念八岁时的",
      "第一情节点 · 周姨端着热汤出现，称呼她「念念」",
      "B 故事 · 苏念从旧相册中发现一张陌生女人的脸",
      "中点 · 假母亲在阁楼藏着一封未寄出的信",
      "反转 · 母亲其实从未离开，而是以另一种方式守了她 24 年",
      "高潮 · 母女在雨夜阁楼相认",
    ]),
    tone: "王家卫 + 是枝裕和 · 湿漉漉的胶片质感",
    twist: "苏念的母亲从未离开，只是为了保护她假装死亡。",
    scene:
      "Scene 12：内景 / 雨夜阁楼 / 烛光摇曳。\n苏念在木箱里翻到一叠发黄的家书，抬眼看见周姨身后的墙上挂着一张合影——那正是 8 岁的自己和现在的自己。",
    hook: "（三秒钩子）外卖小哥冲进暴雨，却看见下单的人，是五年前不告而别的母亲。",
    conflict: "主角必须按时送达最后一单，否则会失去女儿的手术费；但母亲已经病危，只剩最后一面。",
    ending: "反转：母亲早已搬走，下单的是他女儿。",
    duration: "90 秒",
    turns: JSON.stringify([
      "惊讶 · 抬头看到熟悉身影",
      "怀疑 · 不敢相信",
      "确认 · 颤抖着喊出「妈」",
      "反转 · 母亲其实是陌生人",
      "落点 · 泪中微笑，留白",
    ]),
    structure: JSON.stringify([
      "钩子 · 3 秒抓住",
      "痛点 · 真实场景",
      "案例 · 一正一反",
      "总结 · 金句",
      "CTA · 行动号召",
    ]),
    cta: "评论区告诉我，你最破防的一次外卖经历。",
    niche: "知识 · 个人成长",
    platform: "抖音 / 视频号",
    branches: JSON.stringify([
      "节点 A · 医生选择公开真相 → 全员恐慌",
      "节点 B · 医生选择隐瞒 → 内部猜疑",
      "节点 C · 医生选择离开 → 个人觉醒",
    ]),
    endings:
      "3 个结局：真相（全员撤离，但死伤惨重）/ 谎言（真相永埋，但有人觉醒）/ 救赎（医生牺牲换取新生）。",
    stakes: "所有人无法离开医院，否则将死于未知辐射。",
    form: "互动影视 / H5",
  };
  if (samples[key]) return samples[key];
  if (type === "list") return JSON.stringify(["第一项", "第二项", "第三项"]);
  if (type === "struct")
    return "姓名：\n年龄：\n外在：\n内在：\n欲望：\n伤口：\n弧光：";
  return "";
}
