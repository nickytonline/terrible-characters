import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'theme-ui';
import { defaultTheme } from '../themes/defaultTheme';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Terrible Characters!</title>
        <meta name="description" content="Welcome to Web3" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:site_name"
          content="Welcome to the picture portal 📷"
        />
        <meta
          property="og:title"
          content="Welcome to the Terrible Characters app"
        />
        <meta property="og:type" content="website"></meta>
        <meta property="og:url" content="https://nftgame.iamdeveloper.com/" />
        <meta name="twitter:creator" content="@nickytonline" />
        <meta
          name="twitter:description"
          content="Terrible Characters is a fun NFT based game that I built as part of a Buildspace cohort. Try it out and have some fun!"
        />
        <meta
          property="og:description"
          content="Terrible Characters is a fun NFT based game that I built as part of a Buildspace cohort. Try it out and have some fun!"
        />
        <meta name="twitter:image" content="/social-cards/twitter.png" />
        <meta property="og:image:alt" content="The Terrible Characters app" />
        <meta name="twitter:image:alt" content="The Terrible Characters app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <div>
          <Component {...pageProps} />{' '}
        </div>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
