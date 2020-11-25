import React from 'react'

import './CrispTable.scss'

import { CrispProvider } from './CrispContext'

import CrispTableBase from './CrispTableBase'

const CrispTable = (props) =>
  props &&
  props.columns &&
  props.columns.length &&
  React.createElement(CrispProvider, props, React.createElement(CrispTableBase))

export default CrispTable
