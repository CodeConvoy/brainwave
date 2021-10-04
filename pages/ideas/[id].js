import Loading from '../../components/Loading';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import PanToolIcon from '@mui/icons-material/PanTool';

import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/pages/Idea.module.css';

const canvasSize = 512;

let canvas, ctx;

let sketching = false;

let prevX, prevY;
let currX, currY;
let offsetX, offsetY;

const scrollSpeed = 4;

export default function Idea() {
  const canvasRef = useRef();
  const db = getFirestore();
  const router = useRouter();

  // get idea id
  const { id } = router.query;

  const [mode, setMode] = useState('draw');
  const [dialOpen, setDialOpen] = useState(false);

  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);

  const [idea, setIdea] = useState(undefined);

  // retrieves idea from firebase
  async function getIdea() {
    const ideaRef = doc(db, 'ideas', id);
    const ideaDoc = await getDoc(ideaRef);
    setIdea({ ...ideaDoc.data(), id: ideaDoc.id });
  }

  // get idea on start
  useEffect(() => {
    if (id) getIdea();
  }, [id]);

  // called when key is pressed
  function onKeyDown(e) {
    const keyCode = e.keyCode;
    if (keyCode === 37) setCanvasX(oldX => oldX - scrollSpeed); // left
    if (keyCode === 38) setCanvasY(oldY => oldY - scrollSpeed); // up
    if (keyCode === 39) setCanvasX(oldX => oldX + scrollSpeed); // right
    if (keyCode === 40) setCanvasY(oldY => oldY + scrollSpeed); // down
  }

  // on start
  useEffect(() => {
    // get canvas context
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
    // set up key listener
    window.addEventListener('keydown', onKeyDown);
    // clean up listeners on return
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // gets previous and current mouse positions
  function getPrevCurr(e) {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft + window.scrollX;
    currY = e.clientY - canvas.offsetTop + window.scrollY;
  }

  // gets canvas mouse offset
  function getOffset(e) {
    offsetX = e.clientX - canvas.offsetLeft;
    offsetY = e.clientY - canvas.offsetTop;
  }

  // called on canvas mouse down
  function onMouseDown(e) {
    sketching = true;
    if (mode === 'draw') getPrevCurr(e);
    else if (mode === 'move') getOffset(e);
  }

  // draws on canvas with current sketch data
  function draw(e) {
    getPrevCurr(e);
    // draw stroke
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.closePath();
  }

  // moves canvas to mouse position
  function move(e) {
    setCanvasX(e.clientX - offsetX);
    setCanvasY(e.clientY - offsetY);
  }

  // called on canvas mouse move
  function onMouseMove(e) {
    if (!sketching) return;
    if (mode === 'draw') draw(e);
    if (mode === 'move') move(e);
  }

  // stops sketching
  function stopSketch() {
    sketching = false;
  }

  // returns icon for given type
  function getIcon(type) {
    if (type === 'draw') return <EditIcon />;
    else if (type === 'move') return <PanToolIcon />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <Link href="/ideas">
          <a className={styles.backlink}>
            <ArrowBackIcon />
          </a>
        </Link>
        <h1>{idea?.title}</h1>
      </div>
      <canvas
        style={{ position: 'relative', left: canvasX, top: canvasY }}
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopSketch}
        onMouseLeave={stopSketch}
      />
    </div>
  );
}
