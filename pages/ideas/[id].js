import Loading from '../../components/Loading';
import Link from 'next/link';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CommentIcon from '@mui/icons-material/Comment';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';

import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/pages/Idea.module.css';

const canvasWidth = 2048;
const canvasHeight = 2048;

let canvas, ctx;
let container;

let sketching = false;

let prevX, prevY;
let currX, currY;

const scrollSpeed = 4;

const colors = ['black', 'red', 'green', 'blue', 'white'];
const sizes = [1, 2, 3, 4, 5];
let notes = [];

export default function Idea() {
  const containerRef = useRef();
  const canvasRef = useRef();
  const db = getFirestore();
  const router = useRouter();

  // get idea id
  const { id } = router.query;

  const [colorOpen, setColorOpen] = useState(false);
  const [drawColor, setDrawColor] = useState('black');

  const [sizeOpen, setSizeOpen] = useState(false);
  const [drawSize, setDrawSize] = useState(1);

  const [actionOpen, setActionOpen] = useState(false);

  const [idea, setIdea] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // retrieves idea from firebase
  async function getIdea() {
    // get idea data
    const ideaRef = doc(db, 'ideas', id);
    const ideaDoc = await getDoc(ideaRef);
    setIdea({ ...ideaDoc.data(), id: ideaDoc.id });
    const sketch = ideaDoc.data().sketch;
    // if sketch, load image to canvas
    if (sketch) {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
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
    if (id) getIdea();
  }, [id]);

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
    const sketch = canvas.toDataURL();
    const ideaRef = doc(db, 'ideas', id);
    await updateDoc(ideaRef, { sketch });
  }

  // creates a blank note on canvas
  function createNote() {
    notes.push(0);
  }

  return (
    <div className={styles.container} ref={containerRef}>
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
        {
          (!idea || loading) &&
          <Loading />
        }
      </div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={e => { sketching = true; sketch(e); }}
        onMouseMove={e => { if (sketching) draw(e); }}
        onMouseUp={e => { sketching = false; saveCanvas(); }}
        onMouseLeave={e => { sketching = false; saveCanvas(); }}
      />
      <div className={styles.notes}>
        {
          notes.map((note, i) =>
            <textarea key={i} />
          )
        }
      </div>
    </div>
  );
}
