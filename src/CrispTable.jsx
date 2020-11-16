import React, { useContext } from 'react'

// components
import CrispAdvancedSearch from './CrispAdvancedSearch'
import CrispBulkUpdate from './CrispBulkUpdate'
import CrispCheckbox from './CrispCheckbox'
import CrispColumn from './CrispColumn'
import CrispColumnsDisabler from './CrispColumnsDisabler'
import CrispPagination from './CrispPagination'
import CrispProgressIndicator from './CrispProgressIndicator'
import CrispRow from './CrispRow'
import CrispSearch from './CrispSearch'
import DownloadCsv from './DownloadCsv'

// context
import { CrispProvider, CrispContext } from '../CrispContext'

const CrispTable = () => {
  const { tableData, tableDataLoading, selectedRows, toggleAllRows } = useContext(CrispContext)
  const { bulk_update_path, search_path, new_path, title, columns, table_name, records, can_save } = tableData
  const bulk = bulk_update_path && can_save && columns.some(column => column.bulk_editable)

  return (
    <div className="crisp-table">
      <div className="title">{title}</div>
      <div className="crisp-table-top">
        {search_path && <CrispSearch />}
        <DownloadCsv />
        {search_path && <CrispAdvancedSearch />}
        <CrispColumnsDisabler />
        {!!selectedRows.length && <CrispBulkUpdate />}
        <CrispProgressIndicator tableDataLoading={tableDataLoading} />
        {new_path && can_save && (
          <a href={new_path} className="add-entity-button">
            +
          </a>
        )}
      </div>
      <table>
        <thead>
          <tr>
            {bulk && (
              <th className="bulk-cell">
                <CrispCheckbox
                  checked={records.length === selectedRows.length && selectedRows.length !== 0}
                  onChange={toggleAllRows}
                  className="checkbox bulk"
                />
              </th>
            )}
            {columns.map(
              (column, index) =>
                !column.hidden && <CrispColumn column={column} key={`${table_name}-col-${index}`} />
            )}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <CrispRow bulk={bulk} record={record} index={index} key={`${table_name}-row-${index}`} />
          ))}
        </tbody>
      </table>
      <CrispPagination />
    </div>
  )
}

export default props => {
  if (props && props.columns && props.columns.length) {
    return (
      <CrispProvider {...props}>
        <CrispTable />
      </CrispProvider>
    )
  }

  return null
}
