import React, { createRef } from 'react'
import { CSVLink } from 'react-csv'

// contexts
import { CrispContext } from './CrispContext'

export default class DownloadCsv extends React.Component {
  static contextType = CrispContext

  linkRef = createRef()

  state = {
    clicked: false,
  }

  handleAsyncClick = () => {
    this.setState({ clicked: true })
    this.context.getTableData(() => {
      this.linkRef.current.link.click()
      this.setState({ clicked: false })
    })
  }

  render() {
    const { csvData, tableData } = this.context

    return (
      <React.Fragment>
        <button
          className={`download-csv${(this.state.clicked && ' active') ||
            ' inactive'}`}
          onClick={this.handleAsyncClick}>
          <i className='fa fa-download' />
        </button>
        <CSVLink
          style={{ display: 'none' }}
          data={csvData}
          filename={`${tableData.title.toLocaleLowerCase()}.csv`}
          target='_blank'
          ref={this.linkRef}
        />
      </React.Fragment>
    )
  }
}
