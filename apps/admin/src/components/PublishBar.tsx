import { useState } from 'react'
import { Send, Save, Clock } from 'lucide-react'

interface Props {
  onSaveDraft: () => Promise<void>
  onPublish: (scheduledAt?: string) => Promise<void>
  saving: boolean
  articleId: string | null
}

export default function PublishBar({ onSaveDraft, onPublish, saving, articleId }: Props) {
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')

  function handleSchedule() {
    if (!scheduleDate) return
    onPublish(new Date(scheduleDate).toISOString())
    setShowSchedule(false)
  }

  return (
    <div className="card mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onSaveDraft}
            disabled={saving}
            className="btn-secondary"
          >
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => onPublish()}
            disabled={saving}
            className="btn-primary"
          >
            <Send className="mr-1.5 h-4 w-4" />
            {saving ? 'Publishing...' : 'Publish Now'}
          </button>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="btn-secondary"
          >
            <Clock className="mr-1.5 h-4 w-4" />
            Schedule
          </button>
        </div>
        {articleId && (
          <span className="text-xs text-surface-400">ID: {articleId.slice(0, 8)}</span>
        )}
      </div>
      {showSchedule && (
        <div className="mt-4 flex items-center gap-3 pt-4 border-t border-surface-200">
          <input
            type="datetime-local"
            className="input-field"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
          <button onClick={handleSchedule} disabled={!scheduleDate || saving} className="btn-primary">
            Confirm Schedule
          </button>
          <button onClick={() => setShowSchedule(false)} className="btn-secondary">
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
