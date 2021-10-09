import BaseModal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import ClearIcon from '@mui/material-icons/Clear';

export default function Modal(props) {
  const { open, onClose } = props;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        className: styles.backdrop,
        timeout: 100
      }}
    >
      <Fade in={open} timeout={100}>
        <div>
          <button onClick={onClose}>
            <ClearIcon />
          </button>
          {props.children}
        </div>
      </Fade>
    </BaseModal>
  );
}
