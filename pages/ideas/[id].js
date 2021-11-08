import Loading from '../../components/Loading';
import Note from '../../components/Note';
import Img from '../../components/Img';
import Canvas from '../../components/Canvas';
import Minimap from '../../components/Minimap';
import Link from 'next/link';
import Router from 'next/router';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CommentIcon from '@mui/icons-material/Comment';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase9-hooks/firestore';
import { getAuth } from 'firebase/auth';
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';
import { toPng } from 'html-to-image';

import styles from '../../styles/pages/Idea.module.css';

let container;

const noteOffset = 200;

let notesDirty = false;
let imagesDirty = false;

const colors = ['black', 'red', 'green', 'blue', 'white'];
const sizes = [1, 2, 3, 4, 5];

export default function Idea() {
  const containerRef = useRef();
  const fileRef = useRef();
  const db = getFirestore();
  const router = useRouter();
  const auth = getAuth();
  const storage = getStorage();

  // get idea id
  const { id } = router.query;

  const uid = auth.currentUser?.uid;

  const [colorOpen, setColorOpen] = useState(false);
  const [drawColor, setDrawColor] = useState('black');
  const [sizeOpen, setSizeOpen] = useState(false);
  const [drawSize, setDrawSize] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);

  const [image, setImage] = useState(undefined);
  const [notes, setNotes] = useState([]);
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);

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
      color: 'white',
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
    await updateDoc(ideaRef, {
      notes: notes,
      modified: new Date().getTime()
    });
  }

  // update notes and images when idea changes
  useEffect(() => {
    if (ideaData) {
      setNotes(ideaData.notes);
      setImages(ideaData.images);
    }
  }, [ideaData]);

  // clears canvas
  async function clearCanvas() {
    await updateDoc(ideaRef, {
      notes: [],
      sketch: null,
      modified: new Date().getTime()
    });
  }

  // save notes if dirty
  useEffect(() => {
    if (notesDirty) {
      notesDirty = false;
      saveNotes();
    }
  }, [notes]);

  // saves image at given id
  function saveImage(img, id) {
    imagesDirty = true;
    const newImages = images.slice();
    const index = newImages.findIndex(img => img.id === id);
    newImages.splice(index, 1, img);
    setImages(newImages);
  }

  // saves images to firebase
  async function saveImages() {
    const ideaRef = doc(db, 'ideas', id);
    await updateDoc(ideaRef, {
      images: images,
      modified: new Date().getTime()
    });
  }

  // save images if dirty
  useEffect(() => {
    if (imagesDirty) {
      imagesDirty = false;
      saveImages();
    }
  }, [images]);

  // creates an image on canvas
  function createImage(url) {
    imagesDirty = true;
    const newImages = images.slice();
    newImages.push({
      x: container.scrollLeft + noteOffset,
      y: container.scrollTop + noteOffset,
      url: url,
      id: uuid()
    });
    setImages(newImages);
  }

  // uploads current image to firebase
  async function uploadImage() {
    if (!image) return;
    // upload image
    const filePath = `ideas/${id}/${uuid()}`;
    const fileRef = ref(storage, filePath);
    await uploadBytes(fileRef, image);
    // create image
    const url = await getDownloadURL(fileRef);
    createImage(url);
  }

  // removes image with given id
  function removeImage(id) {
    imagesDirty = true;
    const newImages = images.slice();
    const index = newImages.findIndex(img => img.id === id);
    newImages.splice(index, 1);
    setImages(newImages);
  }

  // upload image on change
  useEffect(() => {
    uploadImage();
  }, [image]);

  // downloads canvas as a png
  async function downloadCanvas() {
    // convert container to png
    const url = await toPng(container);
    // download from link element
    const link = document.createElement('a');
    link.download = `${ideaData.title}.png`;
    link.href = url;
    link.click();
  }

  return (
    <>
      {
        !loading &&
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
                fileRef.current.click();
              }}
              icon={<ImageIcon />}
              tooltipTitle="Upload Image"
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
          <input
            className={styles.fileinput}
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
          />
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
        {loading && <Loading />}
        {
          (id && uid) &&
          <Canvas
            drawColor={drawColor} drawSize={drawSize}
            container={container}
            ideaData={ideaData}
            setLoading={setLoading}
            id={id}
          />
        }
        {
          (notes && !loading) &&
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
        {
          (images && !loading) &&
          images.map((img, i) =>
            <Img
              {...img}
              container={container}
              removeImage={removeImage}
              saveImage={saveImage}
              key={img.id}
            />
          )
        }
      </div>
    </>
  );
}
