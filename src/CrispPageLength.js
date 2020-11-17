import React from 'react'

const CrispPageLength = (props) => {
  const unique_page_lengths = {
    10: 1,
    20: 1,
    50: 1,
    100: 1,
    200: 1,
    500: 1,
    1000: 1,
    All: 1,
  }
  unique_page_lengths['' + props.page_length] = 1

  const page_lengths = Object.keys(unique_page_lengths).sort((a, b) => {
    if (a === 'All') {
      return 1
    } else if (b === 'All') {
      return -1
    } else {
      return parseInt(a) - parseInt(b)
    }
  })

  return (
    <div className='crisp-page-length'>
      <span>Page Length:</span>
      <select onChange={props.handlePageLengthChange} value={props.page_length}>
        {page_lengths.map((page_length) => (
          <option key={'page-length-' + page_length} value={page_length}>
            {page_length}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CrispPageLength
