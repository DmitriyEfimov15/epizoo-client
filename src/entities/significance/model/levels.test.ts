import { levelInfo } from './levels'

it('ограничивает уровень шкалой 0–5', () => {
  expect(levelInfo(-1).level).toBe(0)
  expect(levelInfo(3).label).toBe('Высокая для региона')
  expect(levelInfo(9).level).toBe(5)
})
