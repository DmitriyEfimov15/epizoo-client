import { geoAlbers, type GeoPermissibleObjects, geoPath } from 'd3-geo'

export const MAP_WIDTH = 1000
export const MAP_HEIGHT = 560

/**
 * Равновеликая коническая проекция Альберса для России: центральный меридиан 100° в. д.,
 * стандартные параллели 52° и 64°. Разрез антимеридиана уходит в Западное полушарие,
 * поэтому Чукотка не разрывается.
 */
export function makePath(geometry: GeoPermissibleObjects) {
  const projection = geoAlbers()
    .rotate([-100, 0])
    .center([0, 62])
    .parallels([52, 64])
    .fitExtent(
      [
        [8, 8],
        [MAP_WIDTH - 8, MAP_HEIGHT - 8],
      ],
      geometry,
    )
  return geoPath(projection)
}
