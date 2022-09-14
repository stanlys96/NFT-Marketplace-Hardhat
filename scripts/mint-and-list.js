const { ethers, network } = require('hardhat');
const { moveBlocks } = require('../utils/move-blocks');

const NFT_PRICE = ethers.utils.parseEther('0.1');

async function mintAndList() {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const basicNft = await ethers.getContract('BasicNft');

  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  const tokenId = mintTxReceipt.events[0].args.tokenId.toString();

  console.log(`Token ID: ${tokenId} minted!`);

  const approveTx = await basicNft.approve(nftMarketplace.address, tokenId);
  await approveTx.wait(1);

  console.log('Item approved for marketplace!');

  const listItemTx = await nftMarketplace.listItem(
    basicNft.address,
    tokenId,
    NFT_PRICE
  );
  await listItemTx.wait(1);

  console.log('Item listed!');

  if (network.config.chainId == 31337) {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
