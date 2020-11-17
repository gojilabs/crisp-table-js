// context
import { CrispContext } from './CrispContext'

// components
import CrispFieldsModalBase from './CrispFieldsModalBase'

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
            const serializedObj = searchObj.from
              ? {
                  field: key,
                  value: searchObj.from,
                  range_value: searchObj.to,
                }
              : {
                  field: key,
                  value: searchObj,
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
