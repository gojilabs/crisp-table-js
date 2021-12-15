class ValueRenderer {
  constructor(column) {
    this.column = column
  }

  static isValidDate(rawValue) {
    if (rawValue) {
      const valueAsDate = new Date(rawValue)
      return valueAsDate instanceof Date && !isNaN(valueAsDate)
    }

    return false
  }

  static renderBoolean(value, _) {
    return value ? 'Yes' : 'No'
  }

  static renderString(value, _) {
    return value
  }

  static renderInteger(value, column) {
    const intValue = parseInt(value)
    if (!intValue && column.hasOwnProperty('default')) {
      return column.default
    }

    return intValue
  }

  static formatDate(value, column, fallback) {
    if (ValueRenderer.isValidDate(value)) {
      const dateValue = new Date(value)

      const dateFormatter = column.dateFormatter
      if (dateFormatter) {
        return dateFormatter.format(dateValue)
      } else {
        return dateValue[fallback]()
      }
    }

    return null
  }

  static renderDate(value, column) {
    return ValueRenderer.formatDate(value, column, 'toLocaleDateString')
  }

  static renderTime(value, column) {
    if (value && value.toString()) {
      const scrubbedValue = value.toString().replace(' ', 'T')

      return ValueRenderer.formatDate(value, column, 'toLocaleString')
    }

    return null
  }

  static renderUsdMoney(value, column) {
    const number = parseFloat(ValueRenderer.renderInteger(value, column))
    if (!isNaN(number)) {
      return `$ ${(number / 100.0).toFixed(2)}`
    }

    return null
  }

  render = (value) => {
    const renderFunction = this.constructor[`render${this.column.type}`]
    if (renderFunction) {
      return renderFunction(value, this.column)
    }
  }
}

export default ValueRenderer