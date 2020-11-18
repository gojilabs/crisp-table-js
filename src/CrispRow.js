import React, { useContext } from 'react'
import classNames from 'classnames'

// components
import CrispField from './CrispField'
import CrispCheckbox from './CrispCheckbox'

// contexts
import { CrispContext } from './CrispContext'

const CrispRow = ({ index, record, bulk }) => {
  const {
    tableData: { columns },
    selectedRows,
    handleRowSelect,
  } = useContext(CrispContext)

  const rowClassNames = classNames({
    even: index % 2 === 0,
    odd: index % 2 !== 0,
    clickable: record.show_path,
  })

  const handleBulkCheckboxChange = (e) => {
    handleRowSelect(e, record)
  }

  return (
    <tr className={rowClassNames}>
      {bulk && (
        <td className='bulk-cell'>
          <CrispCheckbox
            checked={selectedRows.includes(record)}
            onChange={handleBulkCheckboxChange}
            className='checkbox bulk'
          />
        </td>
      )}
      {columns.map((column, colIndex) => {
        const fieldProps = {
          column: column,
          value: record.record[colIndex],
          record: record,
          key: `row-${index}-col-${colIndex}`,
          href: record.show_path,
          rowIndex: index,
          colIndex,
        }

        return !column.hidden && <CrispField {...fieldProps} />
      })}
    </tr>
  )
}

export default CrispRow
