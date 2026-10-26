import { type FormEvent, useState } from 'react'

import { useFarmStore, useSaveFarm } from '@/entities/farm'
import { RegionSelect } from '@/entities/region'
import type { FarmDto, SpeciesSlug } from '@/shared/api'
import { SPECIES_LABELS, SPECIES_SLUGS } from '@/shared/config'
import { Button, Chip, Field, Input, Notice } from '@/shared/ui'

import styles from './FarmSetupForm.module.css'

interface FarmSetupFormProps {
  farm?: FarmDto
  onDone?: (farm: FarmDto) => void
  onCancel?: () => void
}

/** Профиль хозяйства: регион, район и виды животных. Без регистрации. */
export function FarmSetupForm({ farm, onDone, onCancel }: FarmSetupFormProps) {
  const token = useFarmStore((state) => state.token)
  const setToken = useFarmStore((state) => state.setToken)
  const save = useSaveFarm()
  const [region, setRegion] = useState<string | null>(farm?.region_code ?? null)
  const [district, setDistrict] = useState(farm?.district ?? '')
  const [species, setSpecies] = useState<SpeciesSlug[]>(farm?.species ?? [])
  const [submitted, setSubmitted] = useState(false)

  const regionError = submitted && !region ? 'Выберите регион хозяйства' : undefined
  const speciesError = submitted && species.length === 0 ? 'Отметьте хотя бы один вид' : undefined

  const toggle = (slug: SpeciesSlug) =>
    setSpecies((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]))

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (!region || species.length === 0) return
    save.mutate(
      { token, farm: { region_code: region, district: district.trim() || null, species } },
      {
        onSuccess: (saved) => {
          setToken(saved.token)
          window.scrollTo({ top: 0, behavior: 'smooth' })
          onDone?.(saved)
        },
      },
    )
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Field label="Регион хозяйства" error={regionError}>
        {({ id, describedBy, invalid }) => (
          <RegionSelect id={id} value={region} onChange={setRegion} describedBy={describedBy} invalid={invalid} />
        )}
      </Field>
      <Field label="Район (необязательно)" hint="Поможет точнее отбирать сообщения о соседних пунктах">
        {({ id, describedBy }) => (
          <Input
            id={id}
            aria-describedby={describedBy}
            maxLength={200}
            value={district}
            placeholder="Например, Бийский район"
            onChange={(event) => setDistrict(event.target.value)}
          />
        )}
      </Field>
      <fieldset className={styles.species} aria-describedby={speciesError ? 'species-error' : undefined}>
        <legend className={styles.legend}>Какие животные есть в хозяйстве</legend>
        <div className={styles.chips}>
          {SPECIES_SLUGS.filter((slug) => slug !== 'wildlife').map((slug) => (
            <Chip key={slug} selected={species.includes(slug)} onClick={() => toggle(slug)}>
              {SPECIES_LABELS[slug]}
            </Chip>
          ))}
        </div>
        {speciesError && (
          <p id="species-error" className={styles.error} role="alert">
            {speciesError}
          </p>
        )}
      </fieldset>
      {save.isError && <Notice tone="warning">{save.error.message}</Notice>}
      <Notice tone="info">
        Профиль анонимный: мы не спрашиваем имя и телефон. Ключ доступа хранится только в этом браузере.
      </Notice>
      <div className={styles.actions}>
        <Button type="submit" size="l" disabled={save.isPending}>
          {save.isPending ? 'Сохраняем…' : farm ? 'Сохранить изменения' : 'Показать мою сводку'}
        </Button>
        {onCancel && (
          <Button variant="secondary" size="l" onClick={onCancel}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  )
}
