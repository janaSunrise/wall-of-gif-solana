const anchor = require('@project-serum/anchor');

// Get the reference to the web3 module from anchor
const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log('🚀 Starting test...');

  // Create and set the provider.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  // Get reference to the program
  const program = anchor.workspace.SolanaApp;

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Call start_stuff_off, pass it the params it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    },
    signers: [baseAccount]
  });

  console.log('📝 Your transaction signature', tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString());

  await program.rpc.addGif(
    'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif',
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey
      }
    }
  );

  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString());

  // Access gif_list on the account!
  console.log('👀 GIF List', account.gifList);
};

// Run the main function
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Invoke running
runMain();
