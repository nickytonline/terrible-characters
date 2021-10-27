const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory(
    'NoNonsenseNftGame',
  );
  const gameContract = await gameContractFactory.deploy(
    ['Wolvernick', 'Alpaca head', 'Smasher'], // Names
    [
      'https://no-nonsense-nft-game-nickytonline.vercel.app/nft-images/wolvernick.png',
      'https://no-nonsense-nft-game-nickytonline.vercel.app/nft-images/alpaca-head.png',
      'https://no-nonsense-nft-game-nickytonline.vercel.app/nft-images/smasher.png',
    ],
    [200, 700, 500], // HP values
    [25, 101, 75], // Attack damage values
    'Hulkster Wannabe', // Boss name
    'https://no-nonsense-nft-game-nickytonline.vercel.app/nft-images/hulk_nick.jpg', // Boss image
    10000, // Boss hp
    50, //
  );
  await gameContract.deployed();
  console.log('Contract deployed to:', gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();
  console.log('Minted NFT #1');

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log('Minted NFT #2');

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log('Minted NFT #3');

  // Gas issues at the moment, so just
  // txn = await gameContract.mintCharacterNFT(3);
  // await txn.wait();
  // console.log('Minted NFT #4');

  console.log('Done deploying and minting!');

  console.log('Attacking the big boss!');
  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  // Get the value of the NFT's URI.
  let returnedTokenUri = await gameContract.tokenURI(1);
  console.log('Token URI:', returnedTokenUri);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
