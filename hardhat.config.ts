import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';

require('dotenv').config();

const {
  ALCHEMY_API_URL,
  PRIVATE_RINKEBY_ACCOUNT_KEY = 'PRIVATE_RINKEBY_ACCOUNT_KEY',
} = process.env;

const config: HardhatUserConfig = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: ALCHEMY_API_URL,
      accounts: [PRIVATE_RINKEBY_ACCOUNT_KEY],
    },
  },
};

export default config;
