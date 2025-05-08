const dotenv = require('dotenv');

require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');
require('@typechain/hardhat');

dotenv.config();

const config = {
  solidity: '0.8.17',
  networks: {
    columbus: {
      url: process.env.COLUMBUS_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

exports.default = config;
