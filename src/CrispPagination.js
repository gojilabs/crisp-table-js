import React from 'react'

// components
import CrispPage from './CrispPage'
import CrispPageLength from './CrispPageLength'

// contexts
import { CrispContext } from './CrispContext'

export default class CrispPagination extends React.Component {
  static contextType = CrispContext

  handlePageClick = (page) => {
    const { tableData } = this.context
    const pages = 1 + parseInt(tableData.results_count / tableData.page_length)

    if (page <= pages && page > 0) {
      if (page !== tableData.page) {
        this.context.syncFragmentParams({ page })
      }
    }
  }

  canNavigateToNextPage = () => {
    const { tableData } = this.context
    const pages = 1 + parseInt(tableData.results_count / tableData.page_length)
    return tableData.page < pages && tableData.page >= 1
  }

  canNavigateToPreviousPage = () => {
    const { tableData } = this.context
    const pages = 1 + parseInt(tableData.results_count / tableData.page_length)
    return tableData.page > 1 && tableData.page <= pages
  }

  handlePageLengthChange = (event) => {
    const page_length = event.target.value
    this.context.syncFragmentParams({ page_length, page: 1 })
  }

  render() {
    const { tableData } = this.context
    const pages = 1 + parseInt(tableData.results_count / tableData.page_length)

    const page_components = []
    // default to left-focused
    let start = 1
    let stop = pages

    if (pages - tableData.page <= 10) {
      // right-focused
      start = pages - 10
    } else if (pages > 10) {
      // somewhere in the middle
      start = tableData.page - 5
    }

    if (start < 1) {
      start = 1
    }

    stop = start + 10
    if (stop > pages) {
      stop = pages
    }

    for (let page = start; page <= stop && stop > 1; page++) {
      page_components.push(
        <CrispPage
          key={'page-' + (page - start)}
          page={page}
          onClick={
            page === tableData.page
              ? undefined
              : this.handlePageClick.bind(null, page)
          }
        />,
      )
    }

    const page_text = `${pages} ${pages === 1 ? 'page' : 'pages'}`
    const record_text = `${tableData.records_count} ${
      tableData.records_count === 1 ? 'record' : 'total records'
    }`
    const results_text = `${tableData.results_count} ${
      tableData.results_count === 1 ? 'hit' : 'hits'
    }`

    const next_page_component =
      stop > 1 ? (
        <span
          className={
            'crisp-page' + (this.canNavigateToNextPage() ? '' : ' disabled')
          }
          onClick={
            this.canNavigateToNextPage()
              ? this.handlePageClick.bind(null, tableData.page + 1)
              : null
          }>
          {'>'}
        </span>
      ) : null

    const previous_page_component =
      stop > 1 ? (
        <span
          className={
            'crisp-page' + (this.canNavigateToPreviousPage() ? '' : ' disabled')
          }
          onClick={
            this.canNavigateToPreviousPage()
              ? this.handlePageClick.bind(null, tableData.page - 1)
              : null
          }>
          {'<'}
        </span>
      ) : null

    return (
      <div className='crisp-pagination'>
        <div className='crisp-pagination-line'>
          <div className='left-wrapper'>
            <CrispPageLength
              page_length={tableData.page_length}
              handlePageLengthChange={this.handlePageLengthChange}
            />
          </div>
          <div className='right-wrapper'>
            <p className='statistics'>
              {`${results_text} out of ${record_text} across ${page_text}`}
            </p>
          </div>
        </div>
        <div className='pages'>
          {previous_page_component}
          {page_components}
          {next_page_component}
        </div>
      </div>
    )
  }
}
