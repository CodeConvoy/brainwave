import CloseIcon from '@mui/icons-material/Close';

import { useEffect, useRef, useState } from 'react';

import styles from '../styles/components/Note.module.css';

let dragging = false;

let offsetX, offsetY;

const createOffset = 200;
const saveTimeout = 250;

export default function Note(props) {
  const { index, removeNote, container } = props;

  const [text, setText] = useState(props.text);

  const noteRef = useRef();

  // sets note hold offset
  function setOffset(e) {
    // get note target
    const note = noteRef.current;
    // get note offset
    const x = e.clientX + container.scrollLeft;
    const y = e.clientY + container.scrollTop;
    const noteX = parseInt(note.style.left);
    const noteY = parseInt(note.style.top);
    offsetX = x - noteX;
    offsetY = y - noteY;
  }

  // moves note with given mouse data
  function move(e) {
    // get note target
    const note = noteRef.current;
    // get mouse position
    const x = e.clientX + container.scrollLeft;
    const y = e.clientY + container.scrollTop;
    // set target position
    note.style.left = `${x - offsetX}px`;
    note.style.top = `${y - offsetY}px`;
  }

  // ends dragging
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    saveNote(e);
  }

  // saves note
  function saveNote() {
    // get note target
    const note = noteRef.current;
    // get note position
    const x = parseInt(note.style.left);
    const y = parseInt(note.style.top);
    // return if note not dirty
    if (props.x === x && props.y === y && props.text === text) return;
    // save note
    props.saveNote({ x, y, text }, index);
  }

  // on start
  useEffect(() => {
    // get note target
    const note = noteRef.current;
    // set note position
    note.style.left = `${props.x}px`;
    note.style.top = `${props.y}px`;
  }, []);

  // save note on text change timeout
  useEffect(() => {
    const timeout = setTimeout(saveNote, saveTimeout);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div
      ref={noteRef}
      className={styles.container}
      onMouseDown={e => { dragging = true; setOffset(e); }}
      onMouseMove={e => { if (dragging) move(e); }}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <button onClick={() => removeNote(index)}>
        <CloseIcon />
      </button>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );
}
