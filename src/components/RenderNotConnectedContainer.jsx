const RenderNotConnectedContainer = ({ connectWallet }) => {
  return (
    <div>
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
      >
        Connect to Wallet
      </button>
    </div>
  );
};

export default RenderNotConnectedContainer;
