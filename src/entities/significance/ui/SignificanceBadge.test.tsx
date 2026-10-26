import { render, screen } from '@testing-library/react'

import { SignificanceBadge } from './SignificanceBadge'

it('показывает уровень цифрой и словом, а не только цветом', () => {
  render(<SignificanceBadge level={4} />)
  expect(screen.getByText('4')).toBeInTheDocument()
  expect(screen.getByText('Высокая')).toBeInTheDocument()
})

it('в компактном виде даёт подпись для скринридера', () => {
  render(<SignificanceBadge level={5} compact />)
  expect(screen.getByLabelText('Уровень 5: Чрезвычайная')).toBeInTheDocument()
})
