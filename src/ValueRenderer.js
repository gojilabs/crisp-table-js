class ValueRenderer {
  constructor(column) {
    this.column = column
    if (column.timezone) {
      this.dateFormatter = Intl.DateTimeFormat('default', { timeZone: column.timezone })
    }
  }

  static isValidDate(rawValue) {
    if (rawValue) {
      const valueAsDate = new Date(rawValue)
      return valueAsDate instanceof Date && !isNaN(valueAsDate)
    }

    return false
  }

  renderBoolean = (value) => (value ? 'Yes' : 'No')

  renderString = (value) => (value)

  renderInteger = (value) => {
    const intValue = parseInt(value)
    if (isNaN(intValue) && this.column.hasOwnProperty('default')) {
      return column.default
    }

    return intValue
  }

  renderDate = (value, fallback) => {
    if (ValueRenderer.isValidDate(value)) {
      const fallbackMethod = fallback && fallback.toString().length ? fallback : 'toLocaleDateString'
      const dateValue = new Date(value)

      if (this.dateFormatter) {
        return this.dateFormatter.format(dateValue)
      } else {
        return dateValue[fallbackMethod]()
      }
    }

    return null
  }

  renderTime = (value) => {
    if (value && value.toString()) {
      const scrubbedValue = value.toString().replace(' ', 'T')

      return this.renderDate(value, 'toLocaleString')
    }

    return null
  }

  renderUsdMoney = (value) => {
    const number = parseFloat(this.renderInteger(value))
    if (!isNaN(number)) {
      return `$ ${(number / 100.0).toFixed(2)}`
    }

    return null
  }

  render = (value) => {
    const renderFunction = this[`render${this.column.type}`]
    if (renderFunction) {
      return renderFunction(value)
    }
  }
}

export default ValueRenderer