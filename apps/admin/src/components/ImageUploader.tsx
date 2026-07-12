import { useState, useRef, DragEvent } from 'react'
import { Upload, X, Image } from 'lucide-react'
import { adminApi } from '../lib/api'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUploader({ value, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const res = await adminApi.upload.image(file)
      onChange(res.url)
    } catch {
      window.alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleBrowse() {
    inputRef.current?.click()
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-surface-700 mb-1">{label}</label>}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={handleBrowse}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragOver ? 'border-primary-400 bg-primary-50' : 'border-surface-300 hover:border-surface-400'
        } ${value ? 'p-2' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            <p className="text-sm text-surface-500">Uploading...</p>
          </div>
        ) : value ? (
          <div className="relative w-full">
            <img
              src={value}
              alt="Preview"
              className="h-40 w-full rounded object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange('') }}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-surface-600 shadow hover:bg-white hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-surface-400" />
            <p className="text-sm font-medium text-surface-600">
              Drop an image here or click to browse
            </p>
            <p className="text-xs text-surface-400">JPG, PNG, WebP up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
