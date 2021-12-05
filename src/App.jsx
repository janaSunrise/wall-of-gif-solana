import { useEffect, useState } from 'react';

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';

import RenderConnectedContainer from './components/RenderConnectedContainer';
import RenderNotConnectedContainer from './components/RenderNotConnectedContainer';

import './App.css';

import kp from './keypair.json';
import idl from './assets/idl.json';
import twitterLogo from './assets/twitter-logo.svg';

// Solana runtime reference: SystemRuntime
const { SystemProgram } = web3;

// Initialize the base account
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: 'processed'
};

// Constants
const TWITTER_HANDLE = 'janaSunrise';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // States for wallet
  const [walletAddress, setWalletAddress] = useState(null);
  const [gifList, setGifList] = useState([]);

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

  // Get provider
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  // Function to get the list of gifs
  const getGifList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log('Got the account', account);
      setGifList(account.gifList);
    } catch (error) {
      console.log('Error in getGifList: ', error);
      setGifList(null);
    }
  };

  // Create solana account for gifs
  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      // Start stuff off API
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        signers: [baseAccount]
      });

      // Create account
      console.log(
        'Created a new BaseAccount with address:',
        baseAccount.publicKey.toString()
      );
      await getGifList();
    } catch (error) {
      console.log('Error creating BaseAccount account:', error);
    }
  };

  // Define functions to run on page load
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching gif list.');
      getGifList();
    }

    // eslint-disable-next-line
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 Wall of Gif</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>

          {!walletAddress && (
            <RenderNotConnectedContainer connectWallet={connectWallet} />
          )}

          {walletAddress && (
            <RenderConnectedContainer
              gifList={gifList}
              createGifAccount={createGifAccount}
              getProvider={getProvider}
              Program={Program}
              programID={programID}
              getGifList={getGifList}
              baseAccount={baseAccount}
            />
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
