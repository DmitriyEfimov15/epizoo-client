import { useMemo } from 'react'

import { Combobox } from '@/shared/ui'

import { useRegionRefs } from '../api/queries'

interface RegionSelectProps {
  id?: string
  value: string | null
  onChange: (code: string) => void
  describedBy?: string
  invalid?: boolean
  label?: string
  placeholder?: string
}

/** Поиск региона по названию, синонимам и коду ФНС. */
export function RegionSelect({ placeholder = 'Начните вводить регион', ...rest }: RegionSelectProps) {
  const { data, isPending } = useRegionRefs()
  const options = useMemo(
    () =>
      (data ?? []).map((region) => ({
        value: region.code,
        label: region.name,
        meta: region.federal_district,
        keywords: [...region.aliases, region.code],
      })),
    [data],
  )
  return <Combobox options={options} disabled={isPending} placeholder={placeholder} {...rest} />
}
