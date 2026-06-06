import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Tabs } from './Tabs'

function Sample() {
  return (
    <Tabs defaultValue="a">
      <Tabs.List label="Sections">
        <Tabs.Trigger value="a">First</Tabs.Trigger>
        <Tabs.Trigger value="b">Second</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a">Panel A</Tabs.Content>
      <Tabs.Content value="b">Panel B</Tabs.Content>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('shows only the active panel and marks the selected tab', () => {
    render(<Sample />)
    expect(screen.getByRole('tab', { name: /first/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Panel A')).toBeInTheDocument()
    expect(screen.queryByText('Panel B')).not.toBeInTheDocument()
  })

  it('switches panels on click', () => {
    render(<Sample />)
    fireEvent.click(screen.getByRole('tab', { name: /second/i }))
    expect(screen.getByRole('tab', { name: /second/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Panel B')).toBeInTheDocument()
  })

  it('navigates with ArrowRight', () => {
    render(<Sample />)
    const first = screen.getByRole('tab', { name: /first/i })
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: /second/i })).toHaveAttribute('aria-selected', 'true')
  })

  it('wires aria-controls to the panel', () => {
    render(<Sample />)
    const tab = screen.getByRole('tab', { name: /first/i })
    const panel = screen.getByRole('tabpanel')
    expect(tab.getAttribute('aria-controls')).toBe(panel.id)
  })
})
