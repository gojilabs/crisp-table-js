import React from 'react'

import { CrispContext } from './CrispContext'

export default class CrispBulkActions extends React.Component {
  static contextType = CrispContext

  constructor(props) {
    super(props)

    this.state = {
      actions: props.actions || [],
      selectedRows: props.selectedRows || [],
    }
  }

  getSelectedIds = () => {
    return (this.state.selectedRows || []).map(row => row.id);
  }

  handleBulkAction = (e) => {
    const { actions } = this.state;
    const selectedIndex = e.target.selectedIndex;
    const action = actions[selectedIndex - 1];
    if (!action) return;

    if (action.alert && !window.confirm(action.alert)) {
      e.target.selectedIndex = 0;
      return;
    }

    // Create a form and submit it as POST
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = action.path;

    // Add CSRF token if present in meta tag
    const csrf = document.querySelector('meta[name="csrf-token"]');
    if (csrf) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'authenticity_token';
      input.value = csrf.getAttribute('content');
      form.appendChild(input);
    }

    // Add selected IDs as hidden fields
    const selectedIds = this.getSelectedIds();
    selectedIds.forEach(id => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'ids[]';
      input.value = id;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    e.target.selectedIndex = 0;
  }

  render() {
    const { actions } = this.state;

    return (
      <div className="crisp-bulk-actions">
        <select
          className="bulk-actions-dropdown"
          onChange={this.handleBulkAction}
          defaultValue=""
        >
          <option value="" disabled>
            Bulk actions...
          </option>
          {actions.map((action, idx) => (
            <option value={action.path} key={idx}>
              {action.title}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
