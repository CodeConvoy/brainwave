import CloseIcon from '@mui/icons-material/Close';

import styles from '../styles/components/Note.module.css';

let dragging = false;

let offsetX, offsetY;

const holdOffset = 20;

export default function Note(props) {
  const { index, removeNote, container } = props;

  // moves note with given mouse data
  function move(e) {
    // get mouse position
    const x = e.clientX + container.scrollLeft;
    const y = e.clientY + container.scrollTop;
    // set target position
    const target = e.currentTarget;
    target.style.left = `${x - holdOffset}px`;
    target.style.top = `${y - holdOffset}px`;
  }

  return (
    <div
      className={styles.container}
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
