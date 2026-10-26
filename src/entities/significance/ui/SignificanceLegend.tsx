import { LEVELS } from '../model/levels'
import styles from './SignificanceLegend.module.css'

export function SignificanceLegend({ title = 'Уровень значимости' }: { title?: string }) {
  return (
    <figure>
      <figcaption className="visually-hidden">{title}</figcaption>
      <ul className={styles.legend}>
        {LEVELS.map((info) => (
          <li key={info.level} className={styles.item} title={info.description}>
            <span className={styles.swatch} style={{ background: info.color, color: info.textColor }}>
              {info.level}
            </span>
            {info.label}
          </li>
        ))}
      </ul>
    </figure>
  )
}
