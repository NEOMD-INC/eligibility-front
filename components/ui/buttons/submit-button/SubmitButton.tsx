import { SubmitButtonProps, GotoBackButtonProps } from '@/types/ui/buttons'

const SubmitButton = ({ type, title, class_name, callback_event, btnLoading }: SubmitButtonProps) => {

  const inputProp: any = {
    disabled: btnLoading,
    className: class_name,
    onClick: callback_event
  };

  if (callback_event === '') {
    delete inputProp['onClick'];
  }

  return (
    <button {...inputProp}
      type={type ? type : 'button'}
    >
      {btnLoading ? (
        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
      ) : null}
      <span className='indicator-label'>{btnLoading ? 'Loading...' : title}</span>
    </button>
  );
};

export default SubmitButton;

export const GotoBackButton = ({ id, closeWithAnimation }: GotoBackButtonProps) => {
  
  return (
    <button
      onClick={closeWithAnimation ? closeWithAnimation : null}
      type='button'
      className='mx-3 btn btn btn-light-success '
      id={id}
    >
      Close
    </button>
  )
}