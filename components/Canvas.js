import { useState } from 'react';

const canvasWidth = 2048;
const canvasHeight = 2048;

export default function Canvas() {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <canvas
        style={loading ? { display: 'none' } : null}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={e => { sketching = true; sketch(e); }}
        onMouseMove={e => { if (sketching) draw(e); }}
        onMouseUp={endSketch}
        onMouseLeave={endSketch}
      />
    </div>
  );
}
