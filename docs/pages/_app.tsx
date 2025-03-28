'use client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
// Import the vector icons CSS
import 'react-native-vector-icons/Fonts/Feather.ttf';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
