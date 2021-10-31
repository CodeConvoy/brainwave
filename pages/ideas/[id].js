import Loading from '../../components/Loading';
import Note from '../../components/Note';
import Canvas from '../../components/Canvas';
import Minimap from '../../components/Minimap';
import Link from 'next/link';
import Router from 'next/router';
import HomeIcon from '@mui/icons-material/Home';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CommentIcon from '@mui/icons-material/Comment';
import ImageIcon from '@mui/icons-material/Image';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase9-hooks/firestore';
import { getAuth } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';

import styles from '../../styles/pages/Idea.module.css';

let container;

const noteOffset = 200;

let notesDirty = false;

const colors = ['black', 'red', 'green', 'blue', 'white'];
const sizes = [1, 2, 3, 4, 5];

export default function Idea() {
  const containerRef = useRef();
  const db = getFirestore();
  const router = useRouter();
  const auth = getAuth();

  // get idea id
  const { id } = router.query;

  const uid = auth.currentUser?.uid;

  const [colorOpen, setColorOpen] = useState(false);
  const [drawColor, setDrawColor] = useState('black');

  const [sizeOpen, setSizeOpen] = useState(false);
  const [drawSize, setDrawSize] = useState(1);

  const [actionOpen, setActionOpen] = useState(false);

  const [idea, setIdea] = useState(undefined);

  const [notes, setNotes] = useState([]);

  // listen for idea data
  const ideaRef = doc(db, 'ideas', id ?? '~');
  const [ideaData] = useDocumentData(ideaRef);

  // scrolls container by given values
  function scrollContainer(x, y) {
    if (x) container.scrollLeft += x;
    if (y) container.scrollTop += y;
  }

  // called when canvas scrolled
  function onWheel(e) {
    e.preventDefault();
    scrollContainer(e.deltaX, e.deltaY);
  }

  // set up container on start
  useEffect(() => {
    container = containerRef.current;
    container.addEventListener('wheel', onWheel);
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // creates a blank note on canvas
  function createNote() {
    notesDirty = true;
    const newNotes = notes.slice();
    newNotes.push({
      x: container.scrollLeft + noteOffset,
      y: container.scrollTop + noteOffset,
      text: '',
      id: uuid()
    });
    setNotes(newNotes);
  }

  // removes note with given id
  function removeNote(id) {
    notesDirty = true;
    const newNotes = notes.slice();
    const index = newNotes.findIndex(note => note.id === id);
    newNotes.splice(index, 1);
    setNotes(newNotes);
  }

  // saves note at given id
  function saveNote(note, id) {
    notesDirty = true;
    const newNotes = notes.slice();
    const index = newNotes.findIndex(note => note.id === id);
    newNotes.splice(index, 1, note);
    setNotes(newNotes);
  }

  // saves notes to firebase
  async function saveNotes() {
    const ideaRef = doc(db, 'ideas', id);
    await updateDoc(ideaRef, { notes });
  }

  // save notes if dirty
  useEffect(() => {
    if (notesDirty) {
      notesDirty = false;
      saveNotes();
    }
  }, [notes]);

  return (
    <>
      {
        <div className={styles.toolbar}>
          <SpeedDial
            ariaLabel="colordial"
            open={colorOpen}
            onOpen={() => setColorOpen(true)}
            onClose={() => setColorOpen(false)}
            icon={<FiberManualRecordIcon style={{ color: drawColor }} />}
            direction="down"
          >
            {colors.map((color, i) =>
              <SpeedDialAction
                onClick={() => {
                  setColorOpen(false);
                  ctx.strokeStyle = color;
                  setDrawColor(color);
                }}
                icon={<FiberManualRecordIcon style={{ color: color }} />}
                tooltipTitle={color.charAt(0).toUpperCase() + color.slice(1)}
                key={i}
              />
            )}
          </SpeedDial>
          <SpeedDial
            ariaLabel="sizedial"
            open={sizeOpen}
            onOpen={() => setSizeOpen(true)}
            onClose={() => setSizeOpen(false)}
            icon={<FiberManualRecordIcon style={{ fontSize: drawSize * 8 }} />}
            direction="down"
          >
            {sizes.map((size, i) =>
              <SpeedDialAction
                onClick={() => {
                  setSizeOpen(false);
                  ctx.lineWidth = size;
                  setDrawSize(size);
                }}
                icon={<FiberManualRecordIcon style={{ fontSize: size * 8 }} />}
                tooltipTitle={size}
                key={i}
              />
            )}
          </SpeedDial>
          <SpeedDial
            ariaLabel="actiondial"
            open={actionOpen}
            onOpen={() => setActionOpen(true)}
            onClose={() => setActionOpen(false)}
            icon={<SpeedDialIcon />}
            direction="down"
          >
            <SpeedDialAction
              onClick={() => {
                setActionOpen(false);
                createNote();
              }}
              icon={<CommentIcon />}
              tooltipTitle="Add Note"
            />
            <SpeedDialAction
              onClick={() => {
                setActionOpen(false);
                downloadCanvas();
              }}
              icon={<GetAppIcon />}
              tooltipTitle="Download"
            />
            <SpeedDialAction
              onClick={() => {
                setActionOpen(false);
                if (!window.confirm('Clear canvas?')) return;
                clearCanvas();
              }}
              icon={<DeleteIcon />}
              tooltipTitle="Clear"
            />
          </SpeedDial>
          <span className="flexfill" />
          <button
            onClick={() => Router.push('/ideas')}
            className={styles.homebutton}
          >
            <HomeIcon fontSize="large" />
          </button>
        </div>
      }
      <Minimap ideaData={ideaData} />
      <div className={styles.container} ref={containerRef}>
        {
          (id && uid) ?
          <Canvas
            container={container}
            ideaData={ideaData}
            id={id}
          /> :
          <Loading />
        }
        {
          notes &&
          notes.map((note, i) =>
            <Note
              {...note}
              container={container}
              removeNote={removeNote}
              saveNote={saveNote}
              key={note.id}
            />
          )
        }
      </div>
    </>
  );
}
