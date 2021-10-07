import CloseIcon from '@mui/icons-material/Close';

import styles from '../styles/components/Note.module.css';

export default function Note(props) {
  const { index, removeNote } = props;

  return (
    <div>
      <button onClick={() => removeNote(index)}>
        <CloseIcon />
      </button>
      <textarea />
    </div>
  );
}
