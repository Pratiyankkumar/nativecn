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
        <title>NativeCN - Beautiful UI Components for React Native</title>
        <meta
          name="description"
          content="A React Native UI component library inspired by shadcn/ui. Get beautiful, accessible UI components for your React Native apps by copying and pasting code."
        />
        <meta
          name="keywords"
          content="React Native, UI components, shadcn/ui, mobile development, accessible UI, component library"
        />
        <meta name="author" content="NativeCN" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NativeCN - Beautiful UI Components for React Native" />
        <meta
          property="og:description"
          content="Get beautiful, accessible UI components for your React Native apps by copying and pasting code. Inspired by shadcn/ui."
        />
        <meta property="og:site_name" content="NativeCN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NativeCN - Beautiful UI Components for React Native" />
        <meta
          name="twitter:description"
          content="Get beautiful, accessible UI components for your React Native apps by copying and pasting code. Inspired by shadcn/ui."
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#111827" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
