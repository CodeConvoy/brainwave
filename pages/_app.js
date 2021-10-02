import Head from 'next/head';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

import '../styles/globals.css';

const title = "Brainwave";
const description = "Rich and centralized idea development.";

// initialize firebase
if (!getApps().length) initializeApp(firebaseConfig);

export default function App(props) {
  useAuthState(getAuth());

  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
