import { useState, useRef } from 'react';
import { ImagePlus, Upload, Tag, X } from 'lucide-react';

interface UploadPanelProps {
  onUpload: (formData: FormData) => Promise<unknown>;
}

export default function UploadPanel({ onUpload }: UploadPanelProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title || file.name);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags));

    await onUpload(formData);
    setUploading(false);
    setSuccess(true);
    setTitle('');
    setDescription('');
    setTags([]);
    setFile(null);
    setPreview(null);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ImagePlus size={22} className="text-accent" />
          上传梗图
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 图片上传区 */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-accent/50 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl" />
            ) : (
              <div className="space-y-3">
                <Upload size={40} className="mx-auto text-text-dim" />
                <p className="text-text-dim">点击或拖拽上传梗图</p>
                <p className="text-xs text-text-dim">支持 JPG/PNG/GIF，最大 10MB</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="梗图标题"
            className="input-field w-full"
          />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="梗图描述（可选）"
            rows={2}
            className="input-field w-full resize-none"
          />

          {/* 标签 */}
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="添加标签"
                className="input-field flex-1"
              />
              <button type="button" onClick={addTag} className="btn-secondary flex items-center gap-1">
                <Tag size={14} /> 添加
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : success ? (
              '✅ 上传成功！'
            ) : (
              <>
                <Upload size={16} /> 上传到梗图库
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}