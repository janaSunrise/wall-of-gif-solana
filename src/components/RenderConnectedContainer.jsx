import { useState } from 'react';

import idl from '../assets/idl.json';

const RenderConnectedContainer = ({
  gifList,
  createGifAccount,
  getProvider,
  Program,
  programID,
  getGifList,
  baseAccount
}) => {
  // States
  const [inputValue, setInputValue] = useState('');

  // Input change handler
  const onInputChange = ev => {
    const { value } = ev.target;

    setInputValue(value);
  };

  // Add gif when submit is clicked
  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log('No gif link given!');
      return;
    }
    setInputValue('');
    console.log('Gif link:', inputValue);
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey
        }
      });
      console.log('GIF successfully sent to program', inputValue);

      await getGifList();
    } catch (error) {
      console.log('Error sending GIF:', error);
    }
  };

  if (gifList === null) {
    return (
      <div className="connected-container">
        <button
          className="cta-button submit-gif-button"
          onClick={createGifAccount}
        >
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    );
  }

  return (
    <div className="connected-container">
      <form
        onSubmit={ev => {
          ev.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>

      <div className="gif-grid">
        {gifList.map((item, index) => (
          <div className="gif-item" key={index}>
            <img src={item.gifLink} alt="A gif from the Wall of gif!" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderConnectedContainer;
