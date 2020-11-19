import React from 'react'

// contexts
import { CrispContext } from './CrispContext'

// components
import RemoveButton from './RemoveButton'

export default class CrispField extends React.Component {
  static contextType = CrispContext

  static isValidDate(rawValue) {
    if (rawValue) {
      const valueAsDate = new Date(rawValue)
      return valueAsDate instanceof Date && !isNaN(valueAsDate)
    }

    return false
  }

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

  renderBoolean = () => {
    return this.value() ? 'Yes' : 'No'
  }

  renderString = () => {
    return this.value()
  }

  renderInteger = () => {
    const integer = this.value()
    if (!integer && this.props.column.hasOwnProperty('default')) {
      return this.props.column.default
    }

    return integer
  }

  renderDate = () => {
    const myValue = this.value()
    if (this.constructor.isValidDate(myValue)) {
      return new Date(myValue).toLocaleDateString()
    }

    return null
  }

  renderTime = () => {
    const myValue = this.value()
    if (myValue && myValue.toString()) {
      const scrubbedValue = myValue.toString().replace(' ', 'T')
      if (this.constructor.isValidDate(scrubbedValue)) {
        return new Date(scrubbedValue).toLocaleString()
      }
    }

    return null
  }

  renderUsdMoney = () => {
    const number = parseFloat(this.renderInteger())
    if (!isNaN(number)) {
      return `$ ${(number / 100.0).toFixed(2)}`
    }

    return null
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
    const renderFunction = this[
      `render${column.editable ? 'editable' : column.type}`
    ]

    const wrapWithLink = href && !column.editable && column.type !== 'Button'

    return wrapWithLink ? (
      <td>
        <a href={href} className='table-link'>
          {renderFunction && renderFunction()}
        </a>
      </td>
    ) : (
      <td>{renderFunction && renderFunction()}</td>
    )
  }
}
