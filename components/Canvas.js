import { useEffect, useRef, useState } from 'react';

const canvasWidth = 2048;
const canvasHeight = 2048;
let canvas, ctx;
let sketching;

let prevX, prevY;
let currX, currY;


export default function Canvas() {
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef();

  // get canvas context on start
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
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


  return (
    <canvas
      style={loading ? { display: 'none' } : null}
      ref={canvasRef}
      width={ideaData?.pixels}
      height={ideaData?.pixels}
      onMouseDown={e => { sketching = true; sketch(e); }}
      onMouseMove={e => { if (sketching) draw(e); }}
      onMouseUp={endSketch}
      onMouseLeave={endSketch}
    />
  );
}
