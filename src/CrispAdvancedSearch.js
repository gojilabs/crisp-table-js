// context
import { CrispContext } from './CrispContext'

// components
import CrispFieldsModalBase, { PRESENT_SENTINEL } from './CrispFieldsModalBase'

const emptyCollectedData = [{}]

class CrispAdvancedSearch extends CrispFieldsModalBase {
  static contextType = CrispContext

  clearButtonLabel = 'Clear search'
  enableRange = true

  constructor(props, context) {
    super(props)

    const parsedSearchParams = context.tableData.search_params
      ? Object.keys(context.tableData.search_params).reduce(
          (accumulator, key) => {
            const searchObj = context.tableData.search_params[key]
            let serializedObj
            if (searchObj === PRESENT_SENTINEL) {
              serializedObj = { field: key, value: PRESENT_SENTINEL, isPresent: true }
            } else if (searchObj.from) {
              serializedObj = {
                field: key,
                value: searchObj.from,
                range_value: searchObj.to,
              }
            } else {
              serializedObj = { field: key, value: searchObj }
            }

            return [...accumulator, serializedObj]
          },
          [],
        )
      : []

    this.state = {
      collectedData: parsedSearchParams.length
        ? parsedSearchParams
        : emptyCollectedData,
      showModal: false,
    }

    this.modalTitle = `${context.tableData.title} Advanced Search`
  }

  onSubmit = (searchParams) => {
    this.context.syncFragmentParams({ search_params: searchParams, page: 1 })
    this.toggleModal()
  }
}

export default CrispAdvancedSearch
