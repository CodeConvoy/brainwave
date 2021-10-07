import CloseIcon from '@mui/icons-material/Close';

import styles from '../styles/components/Note.module.css';

export default function Note() {
  return (
    <div>
      <button>
        <CloseIcon />
      </button>
      <textarea />
    </div>
  );
}
