const RemoveButton = (props) => {
  return (
    <a
      type="button"
      onClick={props.onClick}
      className="btn btn-danger remove-button">
      <i className="fa fa-minus" />
    </a>
  )
}

export default RemoveButton
