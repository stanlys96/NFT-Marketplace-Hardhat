const { ethers, network } = require('hardhat');
const { moveBlocks } = require('../utils/move-blocks');

const NFT_PRICE = ethers.utils.parseEther('0.1');

async function mint() {
  const [nftMarketplace, basicNft] = await Promise.all([
    ethers.getContract('NftMarketplace'),
    ethers.getContract('BasicNft'),
  ]);

  console.log(`NFT Address: ${basicNft.address}`);

  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);

  const tokenId = mintTxReceipt.events[0].args.tokenId.toString();

  console.log(`Token ID: ${tokenId} minted!`);

  if (network.config.chainId == 31337) {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

mint()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
