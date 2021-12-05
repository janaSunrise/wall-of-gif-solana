import { useEffect } from 'react';

import './App.css';

import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'janaSunrise';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Define functions to run on page load
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // Check if wallet is connected
  const checkIfWalletIsConnected = () => {
    try {
      // Get the solana object
      const { solana } = window;

      if (solana) {
        // If phantom wallet is found
        if (solana.isPhantom) {
          console.log('Phantom wallet found.');
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Built with ❤️ by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
