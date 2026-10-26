import type { QuarantineDto } from '@/shared/api'

import { sortQuarantines } from './status'

const make = (id: number, status: QuarantineDto['status'], level: number, since: string): QuarantineDto => ({
  id,
  set_event_id: id,
  disease_id: 1,
  disease_slug: 'rabies',
  disease_name: 'Бешенство',
  region_code: '22',
  locality: null,
  species: [],
  status,
  since,
  until: null,
  level,
  source_urls: [],
})

it('ставит действующие карантины выше, затем по уровню и дате', () => {
  const sorted = sortQuarantines([
    make(1, 'unconfirmed', 5, '2026-01-01'),
    make(2, 'active', 3, '2026-09-01'),
    make(3, 'active', 4, '2026-08-01'),
    make(4, 'active', 4, '2026-10-01'),
  ])
  expect(sorted.map((q) => q.id)).toEqual([4, 3, 2, 1])
})
