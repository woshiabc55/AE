import { useState } from 'react';
import { Image as ImageIcon, X, Upload, Link2 } from 'lucide-react';
import type { Panel, ShotType, CameraMove } from '@/lib/types';
import { SHOT_TYPE_LABELS, CAMERA_MOVE_LABELS } from '@/lib/types';

type Props = {
  panel: Panel;
  index: number;
  color: string;
  onChange: (patch: Partial<Panel>) => void;
  onClose: () => void;
};

const SHOT_TYPES: ShotType[] = ['ECU', 'CU', 'MCU', 'MS', 'MLS', 'LS', 'ELS'];
const MOVES: CameraMove[] = ['static', 'pan', 'tilt', 'dolly', 'track', 'crane', 'handheld'];

export default function PanelForm({ panel, index, color, onChange, onClose }: Props) {
  const [imgInput, setImgInput] = useState(panel.imageUrl);
  const [imgMode, setImgMode] = useState<'url' | 'upload'>(panel.imageUrl.startsWith('data:') ? 'upload' : 'url');

  const handleFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ imageUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <aside className="h-full flex flex-col bg-paper-50 border-l border-ink-900/15 animate-slideRight">
      {/* 头部 */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-ink-900/10">
        <div>
          <div className="text-[10px] font-mono tracking-[0.3em] text-ink-400 uppercase">PANEL</div>
          <h3 className="serif text-xl font-semibold text-ink-900 leading-none mt-0.5">
            <span style={{ color }}>№</span>
            {(index + 1).toString().padStart(2, '0')}
          </h3>
        </div>
        <button onClick={onClose} className="text-ink-500 hover:text-ink-900 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* 画面 */}
        <Section title="画面" accent={color}>
          {/* 参考图 */}
          <div className="relative aspect-[4/3] bg-paper-200 border border-ink-900/15 overflow-hidden">
            {panel.imageUrl ? (
              <>
                <img
                  src={panel.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onChange({ imageUrl: '' })}
                  className="absolute top-2 right-2 w-6 h-6 rounded-sm bg-paper-50/90 border border-ink-900/20 text-ink-700 hover:bg-oxblood-500 hover:text-paper-50 hover:border-oxblood-500 flex items-center justify-center"
                  title="移除"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-ink-400 gap-1.5">
                <ImageIcon className="w-7 h-7" strokeWidth={1.25} />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase">无参考图</span>
              </div>
            )}
          </div>

          {/* 输入方式切换 */}
          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={() => setImgMode('url')}
              className={[
                'flex items-center gap-1 px-2 py-1 text-[10px] font-mono tracking-wider rounded-sm border transition-colors',
                imgMode === 'url'
                  ? 'bg-ink-900 text-paper-50 border-ink-900'
                  : 'border-ink-900/20 text-ink-500 hover:border-ink-900/50',
              ].join(' ')}
            >
              <Link2 className="w-3 h-3" /> URL
            </button>
            <button
              onClick={() => setImgMode('upload')}
              className={[
                'flex items-center gap-1 px-2 py-1 text-[10px] font-mono tracking-wider rounded-sm border transition-colors',
                imgMode === 'upload'
                  ? 'bg-ink-900 text-paper-50 border-ink-900'
                  : 'border-ink-900/20 text-ink-500 hover:border-ink-900/50',
              ].join(' ')}
            >
              <Upload className="w-3 h-3" /> 上传
            </button>
          </div>

          {imgMode === 'url' ? (
            <input
              className="input-ink mt-2"
              placeholder="https://..."
              value={imgInput}
              onChange={(e) => setImgInput(e.target.value)}
              onBlur={() => onChange({ imageUrl: imgInput.trim() })}
            />
          ) : (
            <label className="mt-2 flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-ink-900/30 text-ink-500 hover:border-ink-900 hover:text-ink-900 cursor-pointer transition-colors text-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>选择本地图片</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] || null)}
              />
            </label>
          )}
        </Section>

        {/* 画面描述 */}
        <Section title="画面描述" accent={color}>
          <textarea
            className="input-ink"
            placeholder="这一镜里,谁在哪里,做什么。光线、构图、色调..."
            value={panel.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={5}
            maxLength={500}
          />
          <div className="text-[10px] text-ink-400 mt-1 num text-right">
            {panel.description.length} / 500
          </div>
        </Section>

        {/* 声音 */}
        <Section title="声音" accent={color}>
          <Field label="对白">
            <textarea
              className="input-ink"
              placeholder='例:「你怎么来了?」'
              value={panel.dialogue}
              onChange={(e) => onChange({ dialogue: e.target.value })}
              rows={2}
            />
          </Field>
          <Field label="音效 / 配乐">
            <textarea
              className="input-ink"
              placeholder="例:远处火车鸣笛,弦乐渐入"
              value={panel.sound}
              onChange={(e) => onChange({ sound: e.target.value })}
              rows={2}
            />
          </Field>
        </Section>

        {/* 元数据 */}
        <Section title="拍摄参数" accent={color}>
          <Field label="景别">
            <div className="grid grid-cols-7 gap-1">
              {SHOT_TYPES.map((s) => (
                <button
                  key={s}
                  onClick={() => onChange({ shotType: s })}
                  className={[
                    'py-1.5 text-[10px] font-mono tracking-wider rounded-sm border transition-colors',
                    panel.shotType === s
                      ? 'bg-ink-900 text-paper-50 border-ink-900'
                      : 'border-ink-900/15 text-ink-500 hover:border-ink-900/40',
                  ].join(' ')}
                  title={SHOT_TYPE_LABELS[s]}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="运镜">
            <div className="grid grid-cols-4 gap-1">
              {MOVES.map((m) => (
                <button
                  key={m}
                  onClick={() => onChange({ cameraMove: m })}
                  className={[
                    'py-1.5 text-[10px] tracking-wider rounded-sm border transition-colors',
                    panel.cameraMove === m
                      ? 'bg-ink-900 text-paper-50 border-ink-900'
                      : 'border-ink-900/15 text-ink-500 hover:border-ink-900/40',
                  ].join(' ')}
                >
                  {CAMERA_MOVE_LABELS[m]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="时长 (秒)">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.5}
                max={30}
                step={0.5}
                value={panel.duration}
                onChange={(e) => onChange({ duration: parseFloat(e.target.value) })}
                className="flex-1 accent-ink-900"
              />
              <span className="num text-sm w-12 text-right">{panel.duration.toFixed(1)}</span>
            </div>
          </Field>
        </Section>
      </div>
    </aside>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div
        className="flex items-center gap-2 mb-2.5 text-[10px] font-mono tracking-[0.3em] uppercase text-ink-700"
      >
        <span className="w-3 h-px" style={{ background: accent }} />
        {title}
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] text-ink-400 tracking-wider mb-1">{label}</div>
      {children}
    </div>
  );
}
