export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const COMPRESSED_EXTENSIONS = [
  '.zip', '.rar', '.7z', '.tar.gz', '.tar', '.gz', '.bz2', '.xz',
]

export function isCompressedFile(filename: string): boolean {
  const lower = filename.toLowerCase()
  return COMPRESSED_EXTENSIONS.some((ext) => lower.endsWith(ext))
}
