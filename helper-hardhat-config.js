const blockWaitConfirmations = 6;

const developmentChains = ['hardhat', 'localhost'];

const frontEndContractAddressesLocation =
  '../nft-marketplace/constants/networkMapping.json';

const frontEndAbiLocation = '../nft-marketplace/constants/';

module.exports = {
  blockWaitConfirmations,
  developmentChains,
  frontEndContractAddressesLocation,
  frontEndAbiLocation,
};
