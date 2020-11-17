import React from 'react'
import { createPortal } from 'react-dom'
import Modal from 'react-modal'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

// contexts
import { CrispContext } from './CrispContext'

const CalendarContainer = ({ children }) =>
  children
    ? createPortal(
        React.cloneElement(children, {
          className: 'react-datepicker-popper',
        }),
        document.body,
      )
    : null

Modal.setAppElement('body')

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '35px 46px 20px',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 9999,
  },
}

const selectStyles = {
  menuPortal: (styles) => ({
    ...styles,
    zIndex: 9999999,
  }),
  menuList: (styles) => ({
    ...styles,
    maxHeight: 150,
  }),
}

const emptyCollectedData = [{}]

class CrispFieldsModalBase extends React.Component {
  static contextType = CrispContext
  filterColumnsFieldName = 'searchable'

  constructor(props) {
    super(props)

    this.state = {
      collectedData: emptyCollectedData,
      showModal: false,
    }
  }

  handleParamChange = (action, index, newValue) => {
    const collectedData = [...this.state.collectedData]

    switch (action) {
      case 'edit-select':
        collectedData[index] = {}
        collectedData[index].field = newValue
        break
      case 'edit-input':
        collectedData[index].value = Array.isArray(newValue)
          ? newValue.map((el) => el.value)
          : newValue
        break
      case 'edit-range-input':
        collectedData[index].range_value = newValue
        break
      case 'add':
        collectedData.push({})
        break
      case 'remove':
        collectedData.splice(index, 1)
        break
    }

    this.setState({
      collectedData,
    })
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  renderInput = (dataObjIndex, column = {}) => {
    const dataObj = { ...this.state.collectedData[dataObjIndex] }
    const rangeEnabled = column.range && this.enableRange
    let placeholder = 'Enter a value'
    if (column.select_options || column.type === 'Boolean') {
      const selectOptions = column.select_options || [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ]
      const selectedValue = Array.isArray(dataObj.value)
        ? selectOptions.filter((option) =>
            dataObj.value.some((valueEl) => valueEl === option.value),
          )
        : selectOptions.find((option) => dataObj.value === option.value)
      return (
        <Select
          options={selectOptions}
          value={selectedValue}
          onChange={(option) =>
            this.handleParamChange(
              'edit-input',
              dataObjIndex,
              option.value !== undefined ? option.value : option,
            )
          }
          menuPortalTarget={document.querySelector('body')}
          styles={selectStyles}
          isMulti={column.is_multi}
        />
      )
    } else {
      switch (column.type) {
        case 'Date':
        case 'Time':
          placeholder = `date${column.type === 'Time' ? ' and time' : ''}`
          return (
            <React.Fragment>
              <DatePicker
                selected={dataObj.value ? new Date(dataObj.value) : ''}
                popperContainer={CalendarContainer}
                onChange={(value) =>
                  this.handleParamChange(
                    'edit-input',
                    dataObjIndex,
                    new Date(value),
                  )
                }
                showTimeSelect={column.type === 'Time'}
                timeFormat='HH:mm:ss'
                dateFormat={`dd/MM/yyyy${
                  column.type === 'Time' ? ', HH:mm:ss' : ''
                }`}
                placeholderText={`Select${
                  rangeEnabled ? ' start ' : ' '
                }${placeholder}`}
                minDate={new Date(column.min)}
                maxDate={new Date(column.max)}
              />
              {rangeEnabled && (
                <DatePicker
                  selected={
                    dataObj.range_value ? new Date(dataObj.range_value) : ''
                  }
                  popperContainer={CalendarContainer}
                  onChange={(value) =>
                    this.handleParamChange(
                      'edit-range-input',
                      dataObjIndex,
                      new Date(value),
                    )
                  }
                  showTimeSelect={column.type === 'Time'}
                  timeFormat='HH:mm:ss'
                  dateFormat={`dd/MM/yyyy${
                    column.type === 'Time' ? ', HH:mm:ss' : ''
                  }`}
                  placeholderText={`Select end ${placeholder}`}
                  minDate={new Date(column.min)}
                  maxDate={new Date(column.max)}
                />
              )}
            </React.Fragment>
          )
        default:
          let minMaxPostfix = ''
          if (column.type === 'Integer') {
            const minMaxTextArray = []
            placeholder = 'Enter a whole number'

            if (column.min) {
              minMaxTextArray.push(`Min: ${column.min}`)
            }

            if (column.max) {
              minMaxTextArray.push(`Max: ${column.max}`)
            }

            minMaxPostfix = `(${minMaxTextArray.join(' and ')})`
          }

          return (
            <React.Fragment>
              <input
                type='text'
                onChange={(e) => {
                  const newValue =
                    column.type === 'Integer'
                      ? e.target.value.replace(/\D/g, '')
                      : e.target.value
                  this.handleParamChange('edit-input', dataObjIndex, newValue)
                }}
                value={dataObj.value || ''}
                placeholder={`${placeholder}${rangeEnabled ? ' From' : ''}`}
                onBlur={(e) => {
                  if (column.type === 'Integer') {
                    if (parseFloat(e.target.value) < column.min) {
                      this.handleParamChange(
                        'edit-input',
                        dataObjIndex,
                        column.min,
                      )
                    } else if (parseFloat(e.target.value) > column.max) {
                      this.handleParamChange(
                        'edit-input',
                        dataObjIndex,
                        column.max,
                      )
                    }
                  }
                }}
                title={minMaxPostfix}
              />
              {rangeEnabled && (
                <input
                  type='text'
                  onChange={(e) =>
                    this.handleParamChange(
                      'edit-range-input',
                      dataObjIndex,
                      e.target.value,
                    )
                  }
                  value={dataObj.range_value || ''}
                  placeholder={`${placeholder} To`}
                  onBlur={(e) => {
                    if (column.type === 'Integer') {
                      if (parseFloat(e.target.value) < column.min) {
                        this.handleParamChange(
                          'edit-range-input',
                          dataObjIndex,
                          column.min,
                        )
                      } else if (parseFloat(e.target.value) > column.max) {
                        this.handleParamChange(
                          'edit-range-input',
                          dataObjIndex,
                          column.max,
                        )
                      }
                    }
                  }}
                  title={minMaxPostfix}
                />
              )}
            </React.Fragment>
          )
      }
    }
  }

  clearSearch = () => {
    this.setState({ collectedData: emptyCollectedData })
    if (this.onClear) {
      this.onClear()
    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    const collectedData = this.state.collectedData.reduce(
      (accumulator, dataObj) => {
        if (dataObj.field) {
          if (dataObj.range_value) {
            return {
              ...accumulator,
              [dataObj.field]: {
                from: dataObj.value,
                to: dataObj.range_value,
              },
            }
          } else if (dataObj.value || dataObj.value === false) {
            return {
              ...accumulator,
              [dataObj.field]: dataObj.value,
            }
          }
        }
        return accumulator
      },
      {},
    )

    this.onSubmit(collectedData)
  }

  render() {
    const { columns } = this.context.tableData
    const { collectedData, showModal } = this.state

    const searchableColumns = columns.filter(
      (column) => column[this.filterColumnsFieldName],
    )

    return (
      <React.Fragment>
        <button
          onClick={this.toggleModal}
          className={`fields-modal-button ${
            this.context.isAdvancedSearchActive ? '' : 'in'
          }active`}
          type='button'>
          <i className={`fa ${this.buttonIcon || 'fa-search'}`} />
        </button>
        <Modal
          isOpen={showModal}
          style={customStyles}
          onRequestClose={this.toggleModal}>
          <form onSubmit={this.handleFormSubmit} className='fields-modal-modal'>
            {this.modalTitle && <h2>{this.modalTitle}</h2>}
            <ul>
              {collectedData.map((dataObj, index) => {
                const selectedValue = searchableColumns.find(
                  (option) => option.field === dataObj.field,
                )

                return (
                  <li key={index}>
                    <Select
                      value={selectedValue || null}
                      onChange={(selectedObj) =>
                        this.handleParamChange(
                          'edit-select',
                          index,
                          selectedObj.field,
                        )
                      }
                      options={searchableColumns}
                      getOptionLabel={(option) => option.title}
                      getOptionValue={(option) => option.field}
                      placeholder='Select field'
                      styles={selectStyles}
                      isOptionDisabled={(option) =>
                        collectedData.some(
                          (collectedDataObj) =>
                            collectedDataObj.field === option.field,
                        )
                      }
                      menuPortalTarget={document.querySelector('body')}
                    />
                    {this.renderInput(index, selectedValue)}
                    {collectedData.length > 1 && (
                      <button
                        onClick={() => this.handleParamChange('remove', index)}
                        type='button'
                        className='remove-button'
                      />
                    )}
                  </li>
                )
              })}
            </ul>
            <div className='add-new-block'>
              {collectedData !== emptyCollectedData && (
                <button
                  onClick={this.clearSearch}
                  type='button'
                  className='btn btn-default clear-button'>
                  {this.cleanButtonLabel || 'Clear'}
                </button>
              )}
              <button
                onClick={() => this.handleParamChange('add')}
                type='button'
                disabled={collectedData.length === searchableColumns.length}
                className='btn btn-info'>
                Add new
              </button>
            </div>
            {this.getErrorText && (
              <div className='error-text text-danger'>
                {this.getErrorText()}
              </div>
            )}
            <div className='buttons-container'>
              <button
                type='submit'
                className='btn btn-lg btn-success btn-block'>
                Submit
              </button>
              <button
                type='button'
                onClick={this.toggleModal}
                className='btn btn-lg btn-primary'>
                Cancel
              </button>
            </div>
            {this.getFooterText && (
              <div className='footer-text'>{this.getFooterText()}</div>
            )}
          </form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default CrispFieldsModalBase
