import { Link } from 'react-router-dom'

import { QuarantineItem, sortQuarantines } from '@/entities/quarantine'
import { SignificanceBadge } from '@/entities/significance'
import type { RegionDto, RouteResultDto, RouteVerdict as Verdict } from '@/shared/api'
import { routes, speciesLabel } from '@/shared/config'
import { cn, formatCount } from '@/shared/lib'
import { ButtonExternal, Card, Icon, type IconName, Notice } from '@/shared/ui'

import styles from './RouteVerdict.module.css'

const VERDICTS: Record<Verdict, { title: string; text: string; icon: IconName }> = {
  low: {
    title: 'Низкий риск по сообщениям',
    text: 'Сообщений о неснятых карантинах по этому виду нет. Документы оформляются как обычно.',
    icon: 'check',
  },
  elevated: {
    title: 'Повышенный риск',
    text: 'В одном из регионов есть сообщения о болезнях этого вида. Уточните условия до сделки.',
    icon: 'alert',
  },
  high: {
    title: 'Высокий риск',
    text: 'Действуют карантины или значимые события. Перевозка может быть ограничена — согласуйте её с ветслужбой.',
    icon: 'alert',
  },
}

function RegionColumn({ role, region }: { role: string; region: RegionDto }) {
  return (
    <Card className={styles.column}>
      <span className={styles.role}>{role}</span>
      <Link className={styles.name} to={routes.region(region.code)}>
        {region.name}
      </Link>
      <SignificanceBadge level={region.level} size="l" />
      <span>
        {formatCount(region.active_quarantine_count, ['действующий карантин', 'действующих карантина', 'действующих карантинов'])}
        {region.unconfirmed_quarantine_count > 0 && `, ещё ${region.unconfirmed_quarantine_count} не подтверждены`}
      </span>
      {region.quarantines.length > 0 && (
        <ul className={styles.list}>
          {sortQuarantines(region.quarantines).slice(0, 4).map((item) => (
            <li key={item.id}>
              <QuarantineItem quarantine={item} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export function RouteVerdict({ result }: { result: RouteResultDto }) {
  const verdict = VERDICTS[result.verdict]
  return (
    <div className={styles.result}>
      <div className={cn(styles.verdict, styles[result.verdict])} role="status">
        <span className={styles.verdictIcon}>
          <Icon name={verdict.icon} size={28} />
        </span>
        <div>
          <h2>{verdict.title}</h2>
          <p>
            {speciesLabel(result.species)}: {result.from_region.name} → {result.to_region.name}. {verdict.text}
          </p>
        </div>
      </div>

      <div className={styles.columns}>
        <RegionColumn role="Отправление" region={result.from_region} />
        <RegionColumn role="Назначение" region={result.to_region} />
      </div>

      <Card tone="outlined">
        <h3 style={{ font: 'var(--text-h3)', marginBottom: 16 }}>Что сделать перед перевозкой</h3>
        <ol className={styles.checklist}>
          {result.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <div style={{ marginTop: 20 }}>
          <ButtonExternal href={result.official_url} variant="secondary">
            Условия перевозки в «Цербере»
            <Icon name="external" size={18} />
          </ButtonExternal>
        </div>
      </Card>

      <Notice tone="warning">{result.disclaimer}</Notice>
    </div>
  )
}
