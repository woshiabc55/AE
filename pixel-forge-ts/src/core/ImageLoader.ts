export interface ImageSource {
  element: HTMLImageElement;
  data: ImageData;
  width: number;
  height: number;
}

export class ImageLoader {
  static fromFile(file: File): Promise<ImageSource> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const data = ImageLoader.extractImageData(img);
        URL.revokeObjectURL(url);
        resolve({ element: img, data, width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load image from file: ${file.name}`));
      };
      img.src = url;
    });
  }

  static fromURL(url: string): Promise<ImageSource> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const data = ImageLoader.extractImageData(img);
        resolve({ element: img, data, width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image from URL: ${url}`));
      };
      img.src = url;
    });
  }

  static createFallback(width = 64, height = 64): ImageSource {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const checker = ((x >> 3) + (y >> 3)) % 2;
        if (checker) {
          pixels[idx] = 0x6c;
          pixels[idx + 1] = 0x5c;
          pixels[idx + 2] = 0xe7;
          pixels[idx + 3] = 0xff;
        } else {
          pixels[idx] = 0x1a;
          pixels[idx + 1] = 0x1a;
          pixels[idx + 2] = 0x2e;
          pixels[idx + 3] = 0xff;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);

    const img = new Image();
    img.src = canvas.toDataURL();

    return { element: img, data: imageData, width, height };
  }

  private static extractImageData(img: HTMLImageElement): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}
