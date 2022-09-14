const blockWaitConfirmations = 6;

const developmentChains = ['hardhat', 'localhost'];

const frontEndContractAddressesLocation = './constants/networkMapping.json';

const frontEndAbiLocation = './constants/';

module.exports = {
  blockWaitConfirmations,
  developmentChains,
  frontEndContractAddressesLocation,
  frontEndAbiLocation,
};
