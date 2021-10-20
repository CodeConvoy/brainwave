import Head from 'next/head';
import Main from '../components/Main';

import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../util/firebaseConfig';

import '../styles/globals.css';

const title = "Brainwave";
const description = "Rich and centralized idea development.";

// initialize firebase
if (!getApps().length) initializeApp(firebaseConfig);

export default function App(props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;900&display=swap" rel="stylesheet" />
      </Head>
      <Main {...props} />
    </>
  );
}
