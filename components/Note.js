import CloseIcon from '@mui/icons-material/Close';

import { useEffect, useRef, useState } from 'react';

import styles from '../styles/components/Note.module.css';

let dragging = false;

let offsetX, offsetY;

const holdOffset = 20;
const createOffset = 200;
const saveTimeout = 250;

let note;

export default function Note(props) {
  const { index, removeNote, container } = props;

  const [text, setText] = useState(props.text);

  const noteRef = useRef();

  // sets note hold offset
  function setOffset(e) {
    const x = e.clientX + container.scrollLeft;
    const y = e.clientY + container.scrollTop;
    const noteX = parseInt(note.style.left);
    const noteY = parseInt(note.style.top);
    offsetX = x - noteX;
    offsetY = y - noteY;
  }

  // moves note with given mouse data
  function move(e) {
    // get mouse position
    const x = e.clientX + container.scrollLeft;
    const y = e.clientY + container.scrollTop;
    // set target position
    const target = e.currentTarget;
    target.style.left = `${x - offsetX}px`;
    target.style.top = `${y - offsetY}px`;
  }

  // ends dragging
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    saveNote();
  }

  // saves note
  function saveNote() {
    // get note position
    const x = parseInt(note.style.left);
    const y = parseInt(note.style.top);
    // return if note not dirty
    if (props.x === x && props.y === y && props.text === text) return;
    // save note
    props.saveNote({ x, y, text }, index);
  }

  // set note position on start
  useEffect(() => {
    note = noteRef.current;
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
