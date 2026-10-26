import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { Combobox } from './Combobox'

const options = [
  { value: '22', label: 'Алтайский край', keywords: ['22'] },
  { value: '04', label: 'Республика Алтай', keywords: ['Горный Алтай'] },
  { value: '54', label: 'Новосибирская область' },
]

function Harness() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <>
      <Combobox label="Регион" options={options} value={value} onChange={setValue} />
      <output>{value ?? 'нет'}</output>
    </>
  )
}

it('фильтрует по названию и синонимам и выбирает с клавиатуры', async () => {
  render(<Harness />)
  const input = screen.getByRole('combobox', { name: 'Регион' })
  await userEvent.type(input, 'горный')
  expect(screen.getAllByRole('option')).toHaveLength(1)
  await userEvent.keyboard('{Enter}')
  expect(screen.getByText('04')).toBeInTheDocument()
  expect(input).toHaveValue('Республика Алтай')
})

it('сообщает, что ничего не найдено', async () => {
  render(<Harness />)
  await userEvent.type(screen.getByRole('combobox'), 'Марс')
  expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
})
