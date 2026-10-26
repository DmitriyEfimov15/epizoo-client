import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom'
import { type MouseEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { type RegionGeometry, useRegionGeometry } from '@/entities/region'
import { levelInfo } from '@/entities/significance'
import type { MapRegionDto } from '@/shared/api'
import { cn } from '@/shared/lib'
import { ErrorState, Icon, Skeleton } from '@/shared/ui'

import { MAP_HEIGHT, MAP_WIDTH, makePath } from '../lib/projection'
import styles from './EpizooticMap.module.css'

interface EpizooticMapProps {
  data: MapRegionDto[] | undefined
  selected?: string | null
  onSelect: (code: string) => void
  /** Подсветить только эти регионы (например, маршрут перевозки). */
  highlight?: string[]
  /** Приблизить карту к этим регионам. */
  focus?: string[]
  ariaLabel?: string
}

interface Hover {
  code: string
  x: number
  y: number
}

/** Отступ поповера от курсора и от краёв карты. */
const TOOLTIP_GAP = 14
const TOOLTIP_PAD = 8

export function EpizooticMap({ data, selected, onSelect, highlight, focus, ariaLabel }: EpizooticMapProps) {
  const geometry = useRegionGeometry()
  if (geometry.isPending) {
    return (
      <div className={cn(styles.wrap, styles.loading)}>
        <Skeleton height="100%" radius={24} />
      </div>
    )
  }
  if (geometry.isError) return <ErrorState error={geometry.error} onRetry={() => geometry.refetch()} />
  return (
    <MapCanvas
      geometry={geometry.data}
      data={data}
      selected={selected}
      onSelect={onSelect}
      highlight={highlight}
      focus={focus}
      ariaLabel={ariaLabel}
    />
  )
}

function MapCanvas({
  geometry,
  data,
  selected,
  onSelect,
  highlight,
  focus,
  ariaLabel = 'Карта регионов России с уровнем эпизоотической значимости',
}: EpizooticMapProps & { geometry: RegionGeometry }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const groupRef = useRef<SVGGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<Hover | null>(null)

  const path = useMemo(() => makePath(geometry), [geometry])
  const shapes = useMemo(
    () => geometry.features.map((feature) => ({ ...feature.properties, d: path(feature) ?? '' })),
    [geometry, path],
  )
  const byCode = useMemo(() => new Map((data ?? []).map((region) => [region.code, region])), [data])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [MAP_WIDTH, MAP_HEIGHT],
      ])
      .on('zoom', (event) => {
        groupRef.current?.setAttribute('transform', event.transform.toString())
        setHover(null)
      })
    zoomRef.current = behavior
    select(svg).call(behavior)
    return () => {
      select(svg).on('.zoom', null)
    }
  }, [])

  const focusKey = focus?.join(',') ?? ''
  useEffect(() => {
    const svg = svgRef.current
    const behavior = zoomRef.current
    if (!svg || !behavior || !focusKey) return
    const codes = focusKey.split(',')
    const features = geometry.features.filter((feature) => codes.includes(feature.properties.code))
    if (features.length === 0) return
    const [[x0, y0], [x1, y1]] = path.bounds({ type: 'FeatureCollection', features })
    const scale = Math.min(8, 0.8 / Math.max((x1 - x0) / MAP_WIDTH, (y1 - y0) / MAP_HEIGHT))
    const transform = zoomIdentity
      .translate(MAP_WIDTH / 2, MAP_HEIGHT / 2)
      .scale(Math.max(1, scale))
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
    select(svg).call(behavior.transform, transform)
  }, [focusKey, geometry, path])

  const zoomBy = (factor: number) => {
    if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.scaleBy, factor)
  }
  const resetZoom = () => {
    if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.transform, zoomIdentity)
  }

  const onMove = (event: MouseEvent<SVGPathElement>, code: string) => {
    const box = svgRef.current?.parentElement?.getBoundingClientRect()
    if (box) setHover({ code, x: event.clientX - box.left, y: event.clientY - box.top })
  }

  // Карта обрезает содержимое (overflow: hidden), поэтому поповер держим в её границах:
  // по горизонтали прижимаем к краям, а если сверху не помещается — показываем под курсором.
  useLayoutEffect(() => {
    const tip = tooltipRef.current
    const wrap = tip?.parentElement
    if (!tip || !wrap || !hover) return
    const { offsetWidth: width, offsetHeight: height } = tip
    const maxLeft = wrap.clientWidth - width - TOOLTIP_PAD
    const left = Math.max(TOOLTIP_PAD, Math.min(hover.x - width / 2, maxLeft))
    const above = hover.y - height - TOOLTIP_GAP
    const below = Math.min(hover.y + TOOLTIP_GAP, wrap.clientHeight - height - TOOLTIP_PAD)
    tip.style.left = `${left}px`
    tip.style.top = `${above >= TOOLTIP_PAD ? above : Math.max(TOOLTIP_PAD, below)}px`
  }, [hover])

  // Выбранный регион рисуем последним, чтобы обводка не пряталась под соседями.
  const ordered = selected
    ? [...shapes.filter((s) => s.code !== selected), ...shapes.filter((s) => s.code === selected)]
    : shapes
  const hovered = hover ? byCode.get(hover.code) : undefined
  const hoveredName = hover ? (hovered?.name ?? shapes.find((s) => s.code === hover.code)?.name) : undefined

  return (
    <div className={styles.wrap}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role="img"
        aria-label={`${ariaLabel}. Для работы с клавиатуры используйте список регионов.`}
      >
        <g ref={groupRef}>
          {ordered.map((shape) => {
            const region = byCode.get(shape.code)
            const info = levelInfo(region?.level ?? 0)
            return (
              <path
                key={shape.code}
                d={shape.d}
                fill={info.color}
                className={cn(
                  styles.region,
                  shape.code === selected && styles.selected,
                  highlight && !highlight.includes(shape.code) && styles.dimmed,
                )}
                data-code={shape.code}
                onClick={() => onSelect(shape.code)}
                onMouseMove={(event) => onMove(event, shape.code)}
                onMouseLeave={() => setHover(null)}
              />
            )
          })}
        </g>
      </svg>

      <div className={styles.controls}>
        <button type="button" className={styles.control} onClick={() => zoomBy(1.6)} aria-label="Приблизить">
          <Icon name="plus" />
        </button>
        <button type="button" className={styles.control} onClick={() => zoomBy(1 / 1.6)} aria-label="Отдалить">
          <Icon name="minus" />
        </button>
        <button type="button" className={styles.control} onClick={resetZoom} aria-label="Показать всю карту">
          <Icon name="refresh" size={18} />
        </button>
      </div>

      {hover && hoveredName && (
        <div ref={tooltipRef} className={styles.tooltip} aria-hidden="true">
          <p className={styles.tooltipName}>{hoveredName}</p>
          <p className={styles.tooltipRow}>
            Уровень <b>{hovered ? `${hovered.level} · ${levelInfo(hovered.level).label}` : 'нет данных'}</b>
          </p>
          {hovered && (
            <>
              <p className={styles.tooltipRow}>
                Сообщения за период <b>{hovered.event_count}</b>
              </p>
              <p className={styles.tooltipRow}>
                Действующие карантины <b>{hovered.active_quarantine_count}</b>
              </p>
              {hovered.unconfirmed_quarantine_count > 0 && (
                <p className={styles.tooltipRow}>
                  Не подтверждены <b>{hovered.unconfirmed_quarantine_count}</b>
                </p>
              )}
            </>
          )}
        </div>
      )}

      {geometry.attribution && (
        <p className={styles.attribution} title={geometry.attribution}>
          Границы: {geometry.attribution},{' '}
          <a href={geometry.license_url} target="_blank" rel="noopener noreferrer">
            {geometry.license}
          </a>
        </p>
      )}
    </div>
  )
}
