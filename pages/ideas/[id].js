import Loading from '../../components/Loading';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';

import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/pages/Idea.module.css';

const canvasWidth = 3000;
const canvasHeight = 3000;

let canvas, ctx;
let container;

let sketching = false;

let prevX, prevY;
let currX, currY;

const scrollSpeed = 4;

export default function Idea() {
  const containerRef = useRef();
  const canvasRef = useRef();
  const db = getFirestore();
  const router = useRouter();

  // get idea id
  const { id } = router.query;

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
    // get ref contexts
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

  return (
    <div className={styles.container} ref={containerRef}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={e => { sketching = true; sketch(e); }}
        onMouseMove={e => { if (sketching) draw(e); }}
        onMouseUp={e => { sketching = false; }}
        onMouseLeave={e => { sketching = false; }}
      />
    </div>
  );
}
