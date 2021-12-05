import { useState } from 'react';

const RenderConnectedContainer = ({ gifList, setGifList }) => {
  // States
  const [inputValue, setInputValue] = useState('');

  // Input change handler
  const onInputChange = ev => {
    const { value } = ev.target;

    setInputValue(value);
  };

  // Add gif when submit is clicked
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);

      // Set the new gif, and reset input
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };

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
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderConnectedContainer;
