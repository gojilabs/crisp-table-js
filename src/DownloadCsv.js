import React, { createRef } from 'react'
import { CSVLink } from 'react-csv'

// contexts
import { CrispContext } from './CrispContext'

export default class DownloadCsv extends React.Component {
  static contextType = CrispContext

  linkRef = createRef()

  handleAsyncClick = () => {
    this.context.getTableData().then(() => {
      this.linkRef.current.link.click()
    })
  }

  render() {
    const { csvData, tableData } = this.context

    return (
      <React.Fragment>
        <a className='download-csv' onClick={this.handleAsyncClick}>
          <i className='fa fa-download' />
        </a>
        <CSVLink
          data={csvData}
          filename={`${tableData.title.toLocaleLowerCase()}.csv`}
          target='_blank'
          ref={this.linkRef}
        />
      </React.Fragment>
    )
  }
}
