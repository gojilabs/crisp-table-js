import React from 'react'

import './CrispTable.scss'

import { CrispProvider } from './CrispContext'

import CrispTableBase from './CrispTableBase'

const CrispTable = (props) => {
  if (props && props.columns && props.columns.length) {
    return (
      <CrispProvider {...props}>
        <CrispTableBase />
      </CrispProvider>
    )
  }

  return null
}

export default CrispTable
