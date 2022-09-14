const { ethers, network } = require('hardhat');
const {
  developmentChains,
  blockWaitConfirmations,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

require('dotenv').config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const waitConfirmations = developmentChains.includes(network.name)
    ? 1
    : blockWaitConfirmations;

  const arguments = [];

  const nftMarketplace = await deploy('NftMarketplace', {
    from: deployer,
    log: true,
    args: arguments,
    waitConfirmations: waitConfirmations,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(nftMarketplace.address, []);
  }
};

module.exports.tags = ['all', 'nft-marketplace'];
