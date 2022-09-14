const { ethers } = require('hardhat');
const {
  frontEndAbiLocation,
  frontEndContractAddressesLocation,
} = require('../helper-hardhat-config');
const fs = require('fs');

require('dotenv');

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    await updateAbi();
    await updateContractAddresses();
  }
};

async function updateAbi() {
  // WALAO
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  fs.writeFileSync(
    `${frontEndAbiLocation}NftMarketplace.json`,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
  );
  const basicNft = await ethers.getContract('BasicNft');
  fs.writeFileSync(
    `${frontEndAbiLocation}BasicNft.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  // WALAO
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractAddressesLocation, 'utf-8')
  );
  const chainId = network.config.chainId.toString();

  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]['NftMarketplace'].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]['NftMarketplace'].push(nftMarketplace.address);
    }
  } else {
    contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] };
  }
  fs.writeFileSync(
    frontEndContractAddressesLocation,
    JSON.stringify(contractAddresses)
  );
}

module.exports.tags = ['all', 'update-front-end'];
