import * as dotenv from 'dotenv';

import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';

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

export default config;
