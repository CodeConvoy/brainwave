import CloseIcon from '@mui/icons-material/Close';

import { useEffect, useRef } from 'react';

import styles from '../styles/components/Note.module.css';

let dragging = false;

let offsetX, offsetY;

const holdOffset = 20;
const createOffset = 200;

export default function Note(props) {
  const { index, removeNote, container } = props;

  const noteRef = useRef();

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

  // set note position on start
  useEffect(() => {
    const note = noteRef.current;
    note.style.left = `${createOffset + container.scrollLeft}px`;
    note.style.top = `${createOffset + container.scrollTop}px`;
  }, []);

  return (
    <div
      ref={noteRef}
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
