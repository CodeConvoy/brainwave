import Head from 'next/head';
import Main from '../components/Main';

import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../util/firebaseConfig';

import '../styles/globals.css';

// meta
const title = "Brainwave";
const url = "https://brainwave.vercel.app";
const description = "Rich and centralized idea development.";
const image = "https://brainwave.vercel.app/img/cover.png";

// initialize firebase
if (!getApps().length) initializeApp(firebaseConfig);

export default function App(props) {
  return (
    <>
      <Head>
        {/* general */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* links */}
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;900&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href={url} />
        {/* open graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        {/* twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@CodeConvoyOrg" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Head>
      <Main {...props} />
    </>
  );
}
