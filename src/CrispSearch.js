import React from 'react'

// contexts
import { CrispContext } from './CrispContext'

export default class CrispSearch extends React.Component {
  static contextType = CrispContext

  state = {
    counter: 0,
    query: '',
  }

  componentDidMount() {
    const { tableData } = this.context
    if (tableData.search_string) {
      this.setState({ query: tableData.search_string })
    }
  }

  componentWillReceiveProps(newProps, newContext) {
    const { tableData } = this.context
    const newSearchString = newContext.tableData.search_string
    if (tableData.search_string !== newSearchString) {
      this.setState({ query: newSearchString })
    }
  }

  triggerCountdown = (e) => {
    e.preventDefault()

    const { tableData } = this.context
    const new_search_string = e.target.value
    this.setState({ counter: this.state.counter + 1, query: new_search_string })

    setTimeout(() => {
      if (this.state.counter <= 1) {
        this.setState({ counter: 0 })
        if (new_search_string !== tableData.search_string) {
          this.context.syncFragmentParams({
            search_string: new_search_string,
            page: 1,
          })
        }
      } else {
        this.setState({ counter: this.state.counter - 1 })
      }
    }, 500)
  }

  render() {
    const { columns } = this.context.tableData

    if (columns.some((column) => column.searchable)) {
      return (
        <div className='crisp-search'>
          <label>Filter text:</label>
          <input
            type='text'
            onChange={this.triggerCountdown}
            value={this.state.query}
          />
        </div>
      )
    } else {
      return null
    }
  }
}
