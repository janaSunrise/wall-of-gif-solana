import { useEffect, useState } from 'react';

import RenderNotConnectedWallet from './components/RenderNotConnectedWallet';

import './App.css';

import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'janaSunrise';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // States for wallet
  const [walletAddress, setWalletAddress] = useState(null);

  // Define functions to run on page load
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      // Get the solana object
      const { solana } = window;

      if (solana) {
        // If phantom wallet is found
        if (solana.isPhantom) {
          console.log('Phantom wallet found.');

          // Connect
          const response = await solana.connect({ onlyIfTrusted: true });

          // Display pub key if connected
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          // Save to state
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Function to connect wallet
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      // Connect
      const response = await solana.connect();

      // Log it
      console.log('Connected with Public Key:', response.publicKey.toString());

      // Save to state
      setWalletAddress(response.publicKey.toString());
    }
  };

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 Wall of Gif</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>

          {!walletAddress && (
            <RenderNotConnectedWallet connectWallet={connectWallet} />
          )}
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
