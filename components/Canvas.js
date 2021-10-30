import { useEffect, useRef, useState } from 'react';

const canvasWidth = 2048;
const canvasHeight = 2048;
let canvas, ctx;
let sketching;

let prevX, prevY;
let currX, currY;

export default function Canvas(props) {
  const { id, container } = props;

  const [loading, setLoading] = useState(true);
  const canvasRef = useRef();

  // get canvas context on start
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
  }, []);

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
    await updateDoc(ideaRef, { sketch });
  }

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
    ctx.rect(0, 0, ideaData.pixels, ideaData.pixels);
    ctx.fill();
    saveCanvas();
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
