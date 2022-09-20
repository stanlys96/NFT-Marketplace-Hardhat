const { ethers, network } = require('hardhat');
const { moveBlocks } = require('../utils/move-blocks');

const TOKEN_ID = 0;

async function test() {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const basicNft = await ethers.getContract('BasicNft');

  const getCompleteListingIndex =
    await nftMarketplace.getCompleteListingByIndex(0);
  console.log(getCompleteListingIndex.price.toString());
  console.log(getCompleteListingIndex.seller);
  console.log(getCompleteListingIndex.nftAddress);
  console.log(getCompleteListingIndex.tokenId.toString());

  const getCompleteListingTx = await nftMarketplace.getCompleteListingLength();
  console.log(getCompleteListingTx.toString(), ' <<< Length');

  if (network.config.chainId == 31337) {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

test()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
