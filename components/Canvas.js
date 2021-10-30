import { useEffect, useRef, useState } from 'react';

const canvasWidth = 2048;
const canvasHeight = 2048;
let canvas, ctx;

export default function Canvas() {
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef();

  // get canvas context on start
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
  }, []);


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
