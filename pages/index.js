import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';

import styles from '../styles/Index.module.css';

// initialize firebase
if (!getApps().length) initializeApp(firebaseConfig);

export default function Index() {
  return (
    <div>
    </div>
  );
}
