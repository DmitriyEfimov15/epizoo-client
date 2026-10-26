import type { SpeciesSlug } from '@/shared/api'

/** Справочник видов — зеркало SPECIES бэкенда (app/schemas/api.py). */
export const SPECIES_LABELS: Record<SpeciesSlug, string> = {
  cattle: 'КРС',
  small_ruminants: 'МРС',
  pigs: 'Свиньи',
  poultry: 'Птица',
  horses: 'Лошади',
  bees: 'Пчёлы',
  rabbits: 'Кролики',
  carnivores: 'Плотоядные',
  wildlife: 'Дикие животные',
}

export const SPECIES_SLUGS = Object.keys(SPECIES_LABELS) as SpeciesSlug[]

export function isSpeciesSlug(value: string | null | undefined): value is SpeciesSlug {
  return Boolean(value && value in SPECIES_LABELS)
}

export function speciesLabel(slug: SpeciesSlug): string {
  return SPECIES_LABELS[slug]
}
