import React from 'react'

// contexts
import { CrispContext } from './CrispContext'

// components
import RemoveButton from './RemoveButton'

export default class CrispField extends React.Component {
  static contextType = CrispContext

  editable = () => {
    const { column, rowIndex, colIndex } = this.props
    const { handleFieldUpdate } = this.context
    const myValue = this.value()

    const onUpdate = (e) => {
      handleFieldUpdate(rowIndex, colIndex, e)
    }

    switch (column.editable.type) {
      case 'select':
        const label = column.editable.options.find(
          (option) => option.value === myValue,
        )

        return (
          <select value={myValue} onChange={onUpdate}>
            <option value={myValue}>{label ? label.label : 'Not set'}</option>
            {column.editable.options
              .filter((option) => option.value !== myValue)
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        )
    }
  }

  renderArray = () => {
    return this.value().map((v, i) => <p key={'field-' + i}>{v}</p>)
  }

  renderButton = () => {
    const { column, record } = this.props
    const { handleRemove } = this.context

    const onClick = () => {
      handleRemove(column.confirm, record)
    }

    switch (column.action) {
      case 'delete':
        return <RemoveButton onClick={onClick} />
    }
  }

  value = () => {
    const { select_options } = this.props.column
    if (select_options && select_options.length && select_options.find) {
      const option = select_options.find(
        (opt) => opt.value === this.props.value,
      )
      if (option) {
        return option.label
      }
    }

    return this.props.value
  }

  render() {
    const { column, href } = this.props

    let displayValue = null
    if (column.editable) {
      displayValue = this.editable()
    } else {
      switch(column.type) {
        case 'Array':
          displayValue = this.renderArray()
          break
        case 'Button':
          displayValue = this.renderButton()
          break
        default:
          displayValue = column.valueRenderer.render(this.value())
          break
      }
    }

    const wrapWithLink = href && !column.editable && column.type !== 'Button'

    return wrapWithLink ? (
      <td>
        <a href={href} className='table-link'>
          {displayValue}
        </a>
      </td>
    ) : (
      <td>{displayValue}</td>
    )
  }
}
