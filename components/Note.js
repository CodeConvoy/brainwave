import CloseIcon from '@mui/icons-material/Close';

import styles from '../styles/components/Note.module.css';

let dragging = false;

let offsetX, offsetY;

export default function Note(props) {
  const { index, removeNote, container } = props;

  return (
    <div
      onMouseDown={e => { dragging = true; }}
      onMouseMove={e => { if (dragging) move(e); }}
      onMouseUp={e => { dragging = false; }}
      onMouseLeave={e => { dragging = false; }}
    >
      <button onClick={() => removeNote(index)}>
        <CloseIcon />
      </button>
      <textarea />
    </div>
  );
}
