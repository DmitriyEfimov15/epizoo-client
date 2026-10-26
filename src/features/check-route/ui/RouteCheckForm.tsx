import { type FormEvent, useState } from 'react'

import { RegionSelect } from '@/entities/region'
import type { SpeciesSlug } from '@/shared/api'
import { isSpeciesSlug, SPECIES_LABELS, SPECIES_SLUGS } from '@/shared/config'
import { Button, Field, Icon, Select } from '@/shared/ui'

import type { RouteParams } from '../api/use-route-check'
import styles from './RouteCheckForm.module.css'

interface RouteCheckFormProps {
  initial: Partial<RouteParams>
  onSubmit: (params: RouteParams) => void
}

/** «Откуда — куда — кого везём». */
export function RouteCheckForm({ initial, onSubmit }: RouteCheckFormProps) {
  const [from, setFrom] = useState<string | null>(initial.from ?? null)
  const [to, setTo] = useState<string | null>(initial.to ?? null)
  const [species, setSpecies] = useState<SpeciesSlug | ''>(initial.species ?? '')
  const [submitted, setSubmitted] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (from && to && species) onSubmit({ from, to, species })
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <Field label="Откуда (регион отправления)" error={submitted && !from ? 'Выберите регион' : undefined}>
        {({ id, describedBy, invalid }) => (
          <RegionSelect id={id} value={from} onChange={setFrom} describedBy={describedBy} invalid={invalid} />
        )}
      </Field>
      <Button
        className={styles.swap}
        variant="ghost"
        iconOnly
        aria-label="Поменять регионы местами"
        onClick={() => {
          setFrom(to)
          setTo(from)
        }}
      >
        <Icon name="refresh" />
      </Button>
      <Field label="Куда (регион назначения)" error={submitted && !to ? 'Выберите регион' : undefined}>
        {({ id, describedBy, invalid }) => (
          <RegionSelect id={id} value={to} onChange={setTo} describedBy={describedBy} invalid={invalid} />
        )}
      </Field>
      <Field
        label="Животные"
        className={styles.species}
        error={submitted && !species ? 'Выберите вид' : undefined}
      >
        {({ id, describedBy, invalid }) => (
          <Select
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            value={species}
            onChange={(event) => setSpecies(isSpeciesSlug(event.target.value) ? event.target.value : '')}
          >
            <option value="">Выберите вид</option>
            {SPECIES_SLUGS.filter((slug) => slug !== 'wildlife').map((slug) => (
              <option key={slug} value={slug}>
                {SPECIES_LABELS[slug]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Button type="submit" size="m">
        Проверить
      </Button>
    </form>
  )
}
