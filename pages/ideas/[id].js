import Loading from '../../components/Loading';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

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

const colors = ['black', 'red', 'green', 'blue', 'white'];
const sizes = [1, 2, 3, 4, 5];

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
      <div className={styles.toolbar}>
        <SpeedDial
          ariaLabel="colordial"
          open={colorOpen}
          onOpen={() => setColorOpen(true)}
          onClose={() => setColorOpen(false)}
          icon={<SpeedDialIcon />}
          direction="down"
        >
          {colors.map((color, i) =>
            <SpeedDialAction
              onClick={() => {
                setColorOpen(false);
                ctx.strokeStyle = color;
                setDrawColor(color);
              }}
              icon={<FiberManualRecordIcon />}
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
          icon={<SpeedDialIcon />}
          direction="down"
        >
          {sizes.map((size, i) =>
            <SpeedDialAction
              onClick={() => {
                setSizeOpen(false);
                ctx.lineWidth = size;
                setDrawSize(size);
              }}
              icon={<FiberManualRecordIcon />}
              tooltipTitle={size}
              key={i}
            />
          )}
        </SpeedDial>
      </div>
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
