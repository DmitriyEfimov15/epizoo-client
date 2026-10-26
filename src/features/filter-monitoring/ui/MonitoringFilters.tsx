import { useDiseases } from '@/entities/disease'
import { PERIOD_OPTIONS } from '@/entities/region'
import { isSpeciesSlug, SPECIES_LABELS, SPECIES_SLUGS } from '@/shared/config'
import { Button, Field, Icon, Segmented, Select } from '@/shared/ui'

import { useMonitoringFilters } from '../model/use-monitoring-filters'
import styles from './MonitoringFilters.module.css'

interface MonitoringFiltersProps {
  /** Показывать ли выбор периода (на странице болезни он не нужен). */
  withPeriod?: boolean
  withDisease?: boolean
}

export function MonitoringFilters({ withPeriod = true, withDisease = true }: MonitoringFiltersProps) {
  const { filters, update, reset, isDefault } = useMonitoringFilters()
  const { data: diseases = [] } = useDiseases(filters.species)
  const diseaseMissing = filters.disease && !diseases.some((d) => d.slug === filters.disease)

  return (
    <div className={styles.filters} role="group" aria-label="Фильтры">
      <Field label="Вид животных" className={styles.select}>
        {({ id }) => (
          <Select
            id={id}
            value={filters.species ?? ''}
            onChange={(event) => {
              const value = event.target.value
              update({ species: isSpeciesSlug(value) ? value : undefined, disease: undefined })
            }}
          >
            <option value="">Все виды</option>
            {SPECIES_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {SPECIES_LABELS[slug]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      {withDisease && (
      <Field label="Болезнь" className={styles.select}>
        {({ id }) => (
          <Select
            id={id}
            value={diseaseMissing ? '' : (filters.disease ?? '')}
            onChange={(event) => update({ disease: event.target.value || undefined })}
          >
            <option value="">Все болезни</option>
            {diseases.map((disease) => (
              <option key={disease.slug} value={disease.slug}>
                {disease.name}
              </option>
            ))}
          </Select>
        )}
      </Field>
      )}
      {withPeriod && (
        <div className={styles.period}>
          <span className={styles.label} aria-hidden="true">
            Период
          </span>
          <Segmented
            legend="Период"
            value={filters.period}
            options={PERIOD_OPTIONS}
            onChange={(period) => update({ period })}
          />
        </div>
      )}
      {!isDefault && (
        <Button variant="ghost" size="s" onClick={reset}>
          <Icon name="close" size={18} />
          Сбросить
        </Button>
      )}
    </div>
  )
}
