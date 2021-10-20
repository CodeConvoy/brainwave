import Loading from '../../components/Loading';
import Note from '../../components/Note';
import IconButton from '../../components/IconButton';
import Router from 'next/router';
import Link from 'next/link';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CommentIcon from '@mui/icons-material/Comment';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';

import styles from '../../styles/pages/Idea.module.css';

const canvasWidth = 2048;
const canvasHeight = 2048;
const miniWidth = 256;
const miniHeight = 256;

let canvas, ctx;
let miniCanvas, miniCtx;
let container;

let sketching = false;

let prevX, prevY;
let currX, currY;

const noteOffset = 200;

let notesDirty = false;

const colors = ['black', 'red', 'green', 'blue', 'white'];
const sizes = [1, 2, 3, 4, 5];

export default function Idea() {
  const containerRef = useRef();
  const canvasRef = useRef();
  const miniCanvasRef = useRef();
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
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState([]);

  const [minimapOpen, setMinimapOpen] = useState(true);

  // retrieves idea from firebase
  async function getIdea() {
    // get idea data
    const ideaRef = doc(db, 'ideas', id);
    const ideaDoc = await getDoc(ideaRef);
    setIdea({ ...ideaDoc.data(), id: ideaDoc.id });
    // set idea data
    const ideaData = ideaDoc.data();
    setNotes(ideaData.notes);
    const sketch = ideaData.sketch;
    // if sketch, load image to canvas
    if (sketch) {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        miniCtx.drawImage(image, 0, 0, miniWidth, miniHeight);
        setLoading(false);
      }
      image.src = sketch;
    // if no sketch, clear canvas
    } else {
      clearCanvas();
      setLoading(false);
    }
  }

  // get idea on start
  useEffect(() => {
    if (id && uid) getIdea();
  }, [id, uid]);

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

  // on start
  useEffect(() => {
    // get element references
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
    miniCanvas = miniCanvasRef.current;
    miniCtx = miniCanvas.getContext('2d');
    container = containerRef.current;
    // set up container wheel listener
    container.addEventListener('wheel', onWheel);
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // gets previous and current mouse positions
  function sketch(e) {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft + container.scrollLeft;
    currY = e.clientY - canvas.offsetTop + container.scrollTop;
  }

  // ends sketching
  function endSketch() {
    if (!sketching) return;
    sketching = false;
    saveCanvas();
  }

  // draws on canvas with current sketch data
  function draw(e) {
    sketch(e);
    // draw stroke
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.closePath();
  }

  // fills canvas with white
  function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.fill();
  }

  // downloads canvas as a png
  function downloadCanvas() {
    // get canvas object url
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      // download from link element
      const link = document.createElement('a');
      link.download = 'idea.png';
      link.href = url;
      link.click();
    });
  }

  // saves canvas as data url
  async function saveCanvas() {
    // save to firebase
    const sketch = canvas.toDataURL();
    const ideaRef = doc(db, 'ideas', id);
    await updateDoc(ideaRef, { sketch });
    // draw minimap
    const image = new Image();
    image.onload = () => {
      miniCtx.drawImage(image, 0, 0, miniWidth, miniHeight);
    }
    image.src = sketch;
  }

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
        !loading &&
        <div className={styles.toolbar}>
          <IconButton onClick={() => Router.push('/ideas')}>
            <ExitToAppIcon />
          </IconButton>
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
          {
            (!idea || loading) &&
            <Loading />
          }
        </div>
      }
      <div className={styles.minimap}>
        {
          !minimapOpen &&
          <button
            onClick={() => setMinimapOpen(true)}
          >
            <AddIcon />
          </button>
        }
        <canvas
          style={(minimapOpen && !loading) ? null : { display: 'none' }}
          onClick={() => setMinimapOpen(false)}
          ref={miniCanvasRef}
          width={miniWidth}
          height={miniHeight}
          className={styles.minicanvas}
        />
      </div>
      <div className={styles.container} ref={containerRef}>
        {loading && <Loading />}
        <canvas
          style={loading ? { display: 'none' } : null }
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={e => { sketching = true; sketch(e); }}
          onMouseMove={e => { if (sketching) draw(e); }}
          onMouseUp={endSketch}
          onMouseLeave={endSketch}
        />
        {
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
