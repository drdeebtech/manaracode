import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Accordion } from './Accordion'

function Sample(props) {
  return (
    <Accordion {...props}>
      <Accordion.Item value="one" title="Question one">
        Answer one
      </Accordion.Item>
      <Accordion.Item value="two" title="Question two">
        Answer two
      </Accordion.Item>
    </Accordion>
  )
}

describe('Accordion', () => {
  it('headers are collapsed buttons by default', () => {
    render(<Sample />)
    const header = screen.getByRole('button', { name: /question one/i })
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })

  it('expands an item on click and wires aria-controls', () => {
    render(<Sample />)
    const header = screen.getByRole('button', { name: /question one/i })
    fireEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')
    const region = screen.getByRole('region')
    expect(header.getAttribute('aria-controls')).toBe(region.id)
  })

  it('single-open by default: opening one closes the other', () => {
    render(<Sample />)
    fireEvent.click(screen.getByRole('button', { name: /question one/i }))
    fireEvent.click(screen.getByRole('button', { name: /question two/i }))
    expect(screen.getByRole('button', { name: /question one/i })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: /question two/i })).toHaveAttribute('aria-expanded', 'true')
  })

  it('honors defaultOpen', () => {
    render(<Sample defaultOpen={['two']} />)
    expect(screen.getByRole('button', { name: /question two/i })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /question one/i })).toHaveAttribute('aria-expanded', 'false')
  })

  it('allowMultiple keeps several open', () => {
    render(<Sample allowMultiple />)
    fireEvent.click(screen.getByRole('button', { name: /question one/i }))
    fireEvent.click(screen.getByRole('button', { name: /question two/i }))
    expect(screen.getByRole('button', { name: /question one/i })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /question two/i })).toHaveAttribute('aria-expanded', 'true')
  })
})
