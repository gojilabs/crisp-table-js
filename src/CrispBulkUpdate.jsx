// context
import { CrispContext } from '../contexts/CrispContext'

// components
import CrispFieldsModalBase from './CrispFieldsModalBase'

class CrispBulkUpdate extends CrispFieldsModalBase {
  static contextType = CrispContext

  filterColumnsFieldName = 'bulk_editable'
  buttonIcon = 'fa-pencil'

  constructor(props, context) {
    super(props)
    this.modalTitle = `${context.tableData.title} Bulk Update`
  }

  onSubmit = collectedData => {
    this.context.bulkEdit(collectedData, () => window.location.reload(true))
  }

  getFooterText = () => {
    const { selectedRows, tableData } = this.context
    return `Applying this change to ${selectedRows.length} ${tableData.title.toLocaleLowerCase()} record${
      selectedRows.length > 1 ? 's' : ''
    }`
  }

  getErrorText = () => {
    const { errorMessage } = this.context
    return errorMessage ? `Cannot update records - ${errorMessage}` : null
  }
}

export default CrispBulkUpdate
