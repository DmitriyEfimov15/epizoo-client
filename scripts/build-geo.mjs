// Готовит облегчённую геометрию регионов для карты из backend/data/regions.geojson.
import { readFile, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { geoArea } from 'd3-geo'
import mapshaper from 'mapshaper'

const source = fileURLToPath(new URL('../../backend/data/regions.geojson', import.meta.url))
const target = fileURLToPath(new URL('../public/geo/regions.json', import.meta.url))

/**
 * d3-geo работает на сфере: внешнее кольцо должно ограничивать площадь меньше полусферы,
 * а дырка — больше. Иначе полигон трактуется как «весь мир без региона».
 */
function rewindRing(ring, isHole) {
  const area = geoArea({ type: 'Polygon', coordinates: [ring] })
  const coversMoreThanHalf = area > 2 * Math.PI
  return coversMoreThanHalf === isHole ? ring : [...ring].reverse()
}

function rewindPolygon(rings) {
  return rings.map((ring, index) => rewindRing(ring, index > 0))
}

function rewind(geometry) {
  if (geometry.type === 'Polygon') return { ...geometry, coordinates: rewindPolygon(geometry.coordinates) }
  if (geometry.type === 'MultiPolygon') {
    return { ...geometry, coordinates: geometry.coordinates.map(rewindPolygon) }
  }
  return geometry
}

const input = await readFile(source, 'utf8')
const output = await mapshaper.applyCommands(
  '-i regions.geojson -filter-fields code,name -simplify 3% weighted keep-shapes ' +
    '-clean -o regions.json format=geojson precision=0.001',
  { 'regions.geojson': input },
)
const collection = JSON.parse(output['regions.json'])
for (const feature of collection.features) feature.geometry = rewind(feature.geometry)

const { attribution, license, license_url: licenseUrl } = JSON.parse(input)
Object.assign(collection, { attribution, license, license_url: licenseUrl })

const oversized = collection.features.filter((f) => geoArea(f) > 2 * Math.PI)
if (oversized.length) {
  throw new Error(`Неверный порядок обхода: ${oversized.map((f) => f.properties.name).join(', ')}`)
}

await writeFile(target, JSON.stringify(collection))
const { size } = await stat(target)
console.log(`${collection.features.length} регионов, ${(size / 1024).toFixed(0)} КБ → ${target}`)
