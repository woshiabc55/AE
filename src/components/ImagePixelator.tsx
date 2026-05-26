import { useRef, useState, useCallback, useEffect } from 'react';

export default function ImagePixelator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixelSize, setPixelSize] = useState(8);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const pixelate = useCallback((img: HTMLImageElement, pxSize: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maxW = 480;
    const maxH = 360;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const w = Math.floor(img.width * scale);
    const h = Math.floor(img.height * scale);

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const smallW = Math.max(1, Math.floor(w / pxSize));
    const smallH = Math.max(1, Math.floor(h / pxSize));

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = smallW;
    tempCanvas.height = smallH;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.drawImage(img, 0, 0, smallW, smallH);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
  }, []);

  useEffect(() => {
    if (sourceImage) {
      pixelate(sourceImage, pixelSize);
    }
  }, [sourceImage, pixelSize, pixelate]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const generateDemoImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 150;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 200, 150);
    gradient.addColorStop(0, '#003F87');
    gradient.addColorStop(0.5, '#FFD100');
    gradient.addColorStop(1, '#CE1126');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 150);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(100, 75, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00D4AA';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 200;
      const y = Math.random() * 150;
      ctx.fillRect(x, y, 4, 4);
    }

    const img = new Image();
    img.onload = () => setSourceImage(img);
    img.src = canvas.toDataURL();
  }, []);

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? 'border-tropical-yellow bg-tropical-yellow/10'
            : 'border-belize-blue/50 hover:border-belize-blue'
        }`}
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        {sourceImage ? (
          <canvas
            ref={canvasRef}
            className="mx-auto block"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="py-8">
            <p className="text-[8px] text-pixel-white/50 mb-4">拖拽图片到此处</p>
            <div className="flex gap-3 justify-center">
              <label className="pixel-btn cursor-pointer text-[8px]">
                选择图片
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
              <button onClick={generateDemoImage} className="pixel-btn text-[8px]">
                演示图片
              </button>
            </div>
          </div>
        )}
      </div>

      {sourceImage && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[7px] text-pixel-white/70" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              像素粒度
            </span>
            <span className="text-[7px] text-tropical-yellow" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              {pixelSize}px
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="32"
            step="1"
            value={pixelSize}
            onChange={(e) => setPixelSize(Number(e.target.value))}
            className="w-full pixel-slider"
          />
          <div className="flex gap-2">
            <button onClick={generateDemoImage} className="pixel-btn text-[7px]">
              换一张
            </button>
            <label className="pixel-btn cursor-pointer text-[7px]">
              重新选择
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
