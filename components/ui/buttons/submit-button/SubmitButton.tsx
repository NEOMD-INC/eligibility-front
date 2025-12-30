import { SubmitButtonProps } from '@/types/ui/buttons'

const SubmitButton = ({
  type,
  title,
  class_name,
  callback_event,
  btnLoading,
  style,
  onMouseEnter,
  onMouseLeave,
}: SubmitButtonProps & {
  style?: React.CSSProperties
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void
}) => {
  const inputProp: any = {
    disabled: btnLoading,
    className: class_name,
    onClick: callback_event,
    style,
    onMouseEnter,
    onMouseLeave,
  }

  if (callback_event === '') {
    delete inputProp['onClick']
  }

  return (
    <button {...inputProp} type={type ? type : 'button'}>
      {btnLoading ? (
        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
      ) : null}
      <span className="indicator-label">{btnLoading ? 'Loading...' : title}</span>
    </button>
  )
}

export default SubmitButton
