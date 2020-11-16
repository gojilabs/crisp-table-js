const CrispPage = (props) => {
  return (
    <span
      className={'crisp-page' + (props.onClick ? '' : ' disabled')}
      onClick={props.onClick}>
      {props.page}
    </span>
  )
}

export default CrispPage
