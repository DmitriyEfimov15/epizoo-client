import { Link } from 'react-router-dom'

import type { DiseaseDto } from '@/shared/api'
import { routes, speciesLabel } from '@/shared/config'
import { Badge } from '@/shared/ui'

import styles from './DiseaseTile.module.css'

export function DiseaseTile({ disease }: { disease: DiseaseDto }) {
  return (
    <Link to={routes.disease(disease.slug)} className={styles.tile}>
      <span className={styles.name}>{disease.name}</span>
      <span className={styles.text}>{disease.description}</span>
      <span className={styles.tags}>
        {disease.is_zoonosis && <Badge tone="error">Опасно для человека</Badge>}
        {disease.species.map((slug) => (
          <Badge key={slug}>{speciesLabel(slug)}</Badge>
        ))}
      </span>
    </Link>
  )
}
