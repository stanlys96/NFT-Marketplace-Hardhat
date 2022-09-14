const { ethers, network } = require('hardhat');
const { moveBlocks } = require('../utils/move-blocks');

const TOKEN_ID = 1;

async function cancelListing() {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const basicNft = await ethers.getContract('BasicNft');

  const cancelListingTx = await nftMarketplace.cancelListing(
    basicNft.address,
    TOKEN_ID
  );
  await cancelListingTx.wait(1);

  console.log(`Listing canceled!`);

  if (network.config.chainId == 31337) {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

cancelListing()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
