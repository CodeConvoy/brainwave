import Head from 'next/head';

import '../styles/globals.css';

const title = "Brainwave";
const description = "Rich and centralized idea development.";

export default function App(props) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
