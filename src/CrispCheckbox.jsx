const CrispCheckbox = props => (
  <label className="crisp-table__custom-checkbox-wrapper">
    <input {...props} type="checkbox" />
    <span className="custom_checkbox__indicator"/>
  </label>
)

export default CrispCheckbox
