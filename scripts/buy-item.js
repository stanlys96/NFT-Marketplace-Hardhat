const { ethers, network } = require('hardhat');
const { moveBlocks } = require('../utils/move-blocks');

const TOKEN_ID = 0;

async function buyItem() {
  const accounts = await ethers.getSigners();
  const nftMarketplace = await ethers.getContract(
    'NftMarketplace',
    accounts[1]
  );
  const basicNft = await ethers.getContract('BasicNft');
  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
  const price = listing.price.toString();

  console.log(`Price is ${price}`);

  const buyItemTx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
    value: price,
  });
  await buyItemTx.wait(1);

  console.log('Item bought!');

  if (network.config.chainId == 31337) {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

buyItem()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
