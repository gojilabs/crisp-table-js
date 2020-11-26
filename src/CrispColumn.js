import React from 'react'
import classNames from 'classnames'

import { CrispContext } from './CrispContext'

export default class CrispColumn extends React.Component {
  static contextType = CrispContext

  handleOrderChange = () => {
    const { column } = this.props
    const { tableData, syncFragmentParams } = this.context

    const order = { order_field: column.field }
    if (tableData.order.field == column.field) {
      order.order_reverse = tableData.order.reverse ? 0 : 1
    }

    syncFragmentParams({ page: 1, ...order })
  }

  render() {
    const { searchable, sortable, title, field } = this.props.column
    const { tableData } = this.context

    const sortDirection =
      tableData.order.field === field ? !!tableData.order.reverse : undefined

    let sort_arrow = null
    if (sortable) {
      sort_arrow = ' ↕'
      if (tableData.order.field === field && sortDirection !== undefined) {
        sort_arrow = sortDirection ? ' ↑' : ' ↓'
      }
    }

    const rowClassNames = classNames({
      'crisp-column': true,
      searchable: searchable,
      sortable: sortable,
      inactive: sort_arrow === ' ↕',
      active: sort_arrow !== ' ↕',
    })

    return (
      <th
        onClick={sortable ? this.handleOrderChange : undefined}
        className={rowClassNames}>
        <span className='column-name'>{title}</span>
        {sortable && <span className='sort-arrow'>{sort_arrow}</span>}
      </th>
    )
  }
}
