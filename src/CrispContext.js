import React from 'react'
import ValueRenderer from './ValueRenderer'

const CrispContext = React.createContext()
const { Provider, Consumer } = CrispContext

const parseCurrentHash = () =>
  JSON.parse(
    Buffer.from(window.location.hash, 'base64').toString('ascii') || '{}',
  )

const getFragmentParams = (prefix) => {
  try {
    return parseCurrentHash()[prefix] || {}
  } catch (e) {
    return {}
  }
}

const fragmentParamsToState = (tableData) => {
  const params = getFragmentParams(tableData.prefix)

  const newState = {
    page: 1,
    page_length: 25,
    search_string: '',
    order: { field: tableData.columns[0].field, reverse: false },
    search_params: params.search_params,
  }

  const page_length = params.page_length
  if (parseInt(page_length) > 0 || page_length === 'All') {
    newState.page_length = page_length
  }

  const page = parseInt(params.page)
  if (page > 1) {
    newState.page = page
  }

  const search_string = params.search_string
  if (search_string && search_string.length) {
    newState.search_string = search_string
  }

  const order = {
    field: params.order_field,
    reverse: parseInt(params.order_reverse) === 1,
  }
  if (order.field) {
    newState.order = order
  }

  return newState
}

const objToFragmentParams = (obj) => {
  if (!obj) {
    obj = {}
  }

  if (!obj.order) {
    obj.order = {}
  }

  return {
    page_length: obj.page_length,
    page: obj.page,
    order_field: obj.order.field,
    order_reverse: obj.order.reverse ? 1 : 0,
    search_string: obj.search_string,
    search_params: obj.search_params,
  }
}

class CrispProvider extends React.Component {
  defaultColumns = []

  constructor(props) {
    super(props)

    const tableData = { ...props, ...fragmentParamsToState(props) }
    tableData.columns = props.columns.map(column => ({ valueRenderer: new ValueRenderer(column), ...column }))

    this.state = {
      csvData: [],
      tableData: tableData,
      tableDataLoading: false,
      selectedRows: [],
      bottomPaginationOffset: this.props.bottomPaginationOffset || 0,
    }

    this.csrfHeader = props.csrfHeader
    if (!this.csrfHeader || !this.csrfHeader.length) {
      this.csrfHeader = 'X-CSRF-Token'
    }

    this.csrfToken = props.csrfToken
    if (!this.csrfToken || !this.csrfToken.length) {
      this.csrfToken = document.querySelector('meta[name="csrf-token"]').content
    }
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.submitSearchQueryFromFragment)
    this.submitSearchQueryFromFragment()
  }

  syncFragmentParams = (newFragmentParams) => {
    const { tableData } = this.state

    const fragmentParams = objToFragmentParams(fragmentParamsToState(tableData))

    for (let frag in fragmentParams) {
      if (newFragmentParams.hasOwnProperty(frag)) {
        fragmentParams[frag] = newFragmentParams[frag]
      }
    }

    const newHash = {
      ...parseCurrentHash(),
      [`${tableData.prefix}`]: fragmentParams,
    }

    window.location.hash = Buffer.from(JSON.stringify(newHash)).toString(
      'base64',
    )
  }

  submitSearchQueryFromFragment = () => {
    const { tableData } = this.state

    const fragmentStateObj = fragmentParamsToState(tableData)

    this.submitSearchQuery(
      fragmentStateObj.order,
      fragmentStateObj.search_string,
      fragmentStateObj.page_length,
      fragmentStateObj.page,
      fragmentStateObj.search_params,
    )
  }

  submitSearchQuery = (
    order,
    search_string,
    page_length,
    page,
    search_params,
    on_response,
  ) => {
    const { tableData } = this.state
    const { search_path, parent_id, attachments } = tableData
    const { uuid, id } = this.props

    this.setState({ tableDataLoading: true })

    const body = {
      limit: page_length,
      like: search_string,
      order_field: order.field,
      order_reverse: !!order.reverse,
      class: this.props['class'],
      table_class: this.props.table_class,
      parent_id,
      page,
      id,
      search_params,
      uuid,
    }

    for (let attachment in attachments) {
      body[attachment] = attachments[attachment]
    }

    for (let key in body) {
      if (body[key] === undefined || body[key] === null) {
        delete body[key]
      }
    }

    const url = `${search_path}?q=${window.btoa(JSON.stringify(body))}`

    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.setRequestHeader('Content-Type', 'application/json')

    request.onload = () => {
      if (on_response) {
        return on_response(request)
      }

      const data = JSON.parse(request.response)

      this.setState({
        tableData: {
          ...tableData,
          records: data.records,
          records_count: data.records_count,
          results_count: data.results_count,
          order,
          search_string,
          search_params,
          page,
          page_length,
        },
        tableDataLoading: false,
        selectedRows: [],
      })
      this.defaultColumns = data.columns
    }

    request.send()
  }

  handleFieldUpdate = (row_index, column_index, event) => {
    const { tableData } = this.state
    const original_record = tableData.records[row_index]
    const record = {
      id: original_record.id,
    }
    for (let i in tableData.columns) {
      const column = tableData.columns[i]
      record[column.name] =
        column_index === parseInt(i)
          ? event.target.value
          : original_record.record[i]
    }

    const request = new XMLHttpRequest()
    request.open('PUT', original_record.update_path, true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader('X-CSRF-Token', this.csrfToken)

    request.onload = () => {
      let flash = 'notice'
      let message = 'A changeset with your change has been created.'
      if (request.status >= 200 && request.status < 400) {
        const rows = tableData.records
        const row = rows[row_index]
        row.record = tableData.columns.map((column) => record[column.name])
        rows[row_index] = row
        this.setState({ tableData: { ...tableData, records: rows } })
      } else {
        flash = 'alert'
        message = request.responseText
      }

      try {
        eval('GojiLabs.showFlash(flash, message, true)')
        eval('setTimeout(GojiLabs.hideAndClearFlash, 10000)')
      } catch (_) { }
    }

    request.send(JSON.stringify(record))
  }

  handleRemove = (msg, record) => {
    const { tableData } = this.state

    if (record.delete_path && record.delete_path.length) {
      if ((msg && confirm(msg)) || !msg) {
        const request = new XMLHttpRequest()
        request.open('DELETE', record.delete_path, true)
        request.withCredentials = true
        request.setRequestHeader('X-CSRF-Token', this.csrfToken)
        request.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded',
        )
        request.onload = () => {
          if (request.status >= 200 && request.status < 400) {
            const records = tableData.records.filter(
              (recordObj) => recordObj.id !== record.id,
            )
            this.setState({
              tableData: {
                ...tableData,
                records: records,
                records_count: records.length,
                results_count: this.state.results_count - 1,
                query_in_progress: false,
              },
            })
          }
        }
        request.send()
      }
    }
  }

  handleGetTableData = (with_table_data) => {
    const { tableData } = this.state
    const { columns, order, search_string } = tableData
    const { search_params } = fragmentParamsToState(tableData)

    return this.submitSearchQuery(
      order,
      search_string,
      'All',
      1,
      search_params,
      (request) => {
        const data = JSON.parse(request.response)

        const recordIndices = []
        const recordArrays = [[]]

        columns.forEach((column, index) => {
          if (!column.hidden) {
            recordIndices.push(index)
            recordArrays[0].push(column.title)
          }
        })

        data.records.forEach((row) => {
          recordArrays.push(recordIndices.map((index) => columns[index].valueRenderer.render(row.record[index])))
        })

        this.setState({
          csvData: recordArrays,
        })

        if (with_table_data) {
          return with_table_data(data)
        }

        return data
      },
    )
  }

  toggleColumns = (e) => {
    const { tableData } = this.state

    const columns = tableData.columns.slice()
    const column = columns[e.target.value]
    columns[e.target.value] = { ...column, hidden: !column.hidden }

    this.setState({
      tableData: {
        ...tableData,
        columns,
      },
    })
  }

  setDefaultColumnsVisibility = () => {
    const { tableData } = this.state

    this.setState({
      tableData: {
        ...tableData,
        columns: this.defaultColumns,
      },
    })
  }

  toggleAllRows = (e) => {
    let selectedRows = e.target.checked ? this.state.tableData.records : []

    this.setState({ selectedRows })
  }

  handleRowSelect = (e, value) => {
    const selectedRows = this.state.selectedRows.slice()
    if (e.target.checked) {
      selectedRows.push(value)
    } else {
      const rowIndex = selectedRows.findIndex((row) => row === value)
      selectedRows.splice(rowIndex, 1)
    }

    this.setState({ selectedRows })
  }

  bulkEdit = (collectedData, onSuccess) => {
    const { bulk_update_path, prefix } = this.state.tableData
    const requestBody = {
      table: prefix.slice(0, prefix.length - 1),
      changed_fields: collectedData,
      ids: this.state.selectedRows.map((row) => row.id),
    }

    const request = new XMLHttpRequest()
    request.open('PUT', bulk_update_path, true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader('X-CSRF-Token', this.csrfToken)

    request.onload = () => {
      this.setState({ selectedRows: [] }, () => onSuccess())
    }

    request.send(JSON.stringify(requestBody))
  }

  hasColumnVisibilityChanged = () => {
    const defaultColumns = this.defaultColumns || []
    const columns = this.state.tableData.columns || []

    if (!defaultColumns.length) {
      return false
    }

    return (
      defaultColumns.length !== columns.length ||
      !defaultColumns.every(
        (column, index) =>
          columns[index] &&
          column &&
          !!columns[index].hidden === !!column.hidden,
      )
    )
  }

  isAdvancedSearchActive = () => {
    const { tableData } = this.state
    const f_search_params = getFragmentParams(tableData.prefix).search_params
    const s_search_params = this.state.search_params

    return (
      (f_search_params && Object.keys(f_search_params).length) ||
      (s_search_params && Object.keys(s_search_params).length)
    )
  }

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          getTableData: this.handleGetTableData,
          syncFragmentParams: this.syncFragmentParams,
          handleFieldUpdate: this.handleFieldUpdate,
          handleRemove: this.handleRemove,
          toggleColumns: this.toggleColumns,
          areHiddenColumnsVisible: this.areHiddenColumnsVisible,
          setDefaultColumnsVisibility: this.setDefaultColumnsVisibility,
          toggleAllRows: this.toggleAllRows,
          hasColumnVisibilityChanged: this.hasColumnVisibilityChanged(),
          isAdvancedSearchActive: this.isAdvancedSearchActive(),
          handleRowSelect: this.handleRowSelect,
          bulkEdit: this.bulkEdit,
        }}>
        {this.props.children}
      </Provider>
    )
  }
}

export { CrispProvider, Consumer as CrispConsumer, CrispContext }
