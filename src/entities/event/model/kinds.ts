import type { EventKind } from '@/shared/api'
import type { BadgeTone } from '@/shared/ui'

export const EVENT_KINDS: Record<EventKind, { label: string; tone: BadgeTone }> = {
  outbreak: { label: 'Сообщение о случае', tone: 'warning' },
  quarantine_set: { label: 'Карантин введён', tone: 'error' },
  quarantine_lifted: { label: 'Карантин снят', tone: 'brand' },
}

export const EVENT_KIND_OPTIONS = (Object.keys(EVENT_KINDS) as EventKind[]).map((kind) => ({
  value: kind,
  label: EVENT_KINDS[kind].label,
}))
