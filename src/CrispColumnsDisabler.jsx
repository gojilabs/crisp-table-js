import React from 'react'
import Modal from 'react-modal'
import { CrispContext } from '../contexts/CrispContext'

Modal.setAppElement('body')

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '35px 46px 60px'
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 9999
  }
}

class CrispColumnsDisabler extends React.Component {
  static contextType = CrispContext

  state = {
    showModal: false
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  render() {
    const { columns, title } = this.context.tableData
    const { showModal } = this.state

    return (
      <React.Fragment>
        <button
          onClick={this.toggleModal}
          className={`columns-disabler-button ${this.context.hasColumnVisibilityChanged ? '' : 'in'}active`}
        >
          <i className="fa fa-columns" />
        </button>
        <Modal isOpen={showModal} style={customStyles} onRequestClose={this.toggleModal}>
          <div className="columns-disabler-modal">
            <h2 className="text-center">{title} Table</h2>
            <h4 className="text-center">Column Visibility</h4>
            <ul>
              {columns.map((column, index) => (
                <li key={column.title}>
                  <label>
                    <CrispCheckbox
                      checked={!column.hidden}
                      value={index}
                      onChange={this.context.toggleColumns}
                    />
                    {column.title}
                  </label>
                </li>
              ))}
            </ul>
            <div className="buttons-container">
              <button
                type="button"
                onClick={this.context.setDefaultColumnsVisibility}
                className="btn btn-lg btn-success"
              >
                Reset to default
              </button>
              <button type="button" onClick={this.toggleModal} className="btn btn-lg btn-primary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

export default CrispColumnsDisabler
