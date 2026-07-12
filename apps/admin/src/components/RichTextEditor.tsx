import { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3,
  Quote, List, ListOrdered, Link, Image, Pilcrow,
} from 'lucide-react'
import { adminApi } from '../lib/api'

interface Props {
  content: string
  onChange: (html: string) => void
}

function MenuButton({ onClick, active, children, title }: {
  onClick: () => void
  active: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded p-1.5 text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 ${
        active ? 'bg-primary-100 text-primary-700' : ''
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      ImageExtension.configure({ inline: false }),
      Placeholder.configure({ placeholder: 'Start writing your article...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-surface max-w-none min-h-[400px] px-4 py-3 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL:', previousUrl || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL:')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const addVideo = useCallback(() => {
    if (!editor) return
    const url = window.prompt('YouTube/Vimeo URL:')
    if (!url) return

    let embedUrl = ''
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (ytMatch) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
    } else if (vimeoMatch) {
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    if (!embedUrl) return

    editor
      .chain()
      .focus()
      .setNode('paragraph')
      .insertContent(
        `<div class="aspect-video relative my-4"><iframe src="${embedUrl}" class="absolute inset-0 w-full h-full rounded" frameborder="0" allowfullscreen></iframe></div>`
      )
      .run()
  }, [editor])

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file || !editor) return
      try {
        const res = await adminApi.upload.image(file)
        editor.chain().focus().setImage({ src: res.url }).run()
      } catch {
        window.alert('Failed to upload image')
      }
    }
    input.click()
  }, [editor])

  if (!editor) return null

  return (
    <div className="overflow-hidden rounded-lg border border-surface-200">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-surface-200 bg-surface-50 px-2 py-1.5">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon className="h-4 w-4" />
        </MenuButton>

        <span className="mx-1 h-5 w-px bg-surface-200" />

        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </MenuButton>

        <span className="mx-1 h-5 w-px bg-surface-200" />

        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </MenuButton>

        <span className="mx-1 h-5 w-px bg-surface-200" />

        <MenuButton onClick={setLink} active={editor.isActive('link')} title="Insert link">
          <Link className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={addImage} active={false} title="Insert image URL">
          <Image className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={handleImageUpload} active={false} title="Upload image">
          <Image className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={addVideo} active={false} title="Embed video">
          <Pilcrow className="h-4 w-4" />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
