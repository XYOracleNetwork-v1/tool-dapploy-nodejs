/*
  This is an auto-generated web3 interface to the smart contracts deployed via Dapploy
  Do not make changes to this file, they get overwritten each Dapploy :)
*/
/* eslint-disable */
import Web3 from 'web3';

PORTIS_DECLARATION;

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider);
  }
  PORTIS_PROVIDER;
};

const contractObject = name => SmartContracts.find(contract => contract.name === name);

export const contractNamed = name => {
  const contractObj = contractObject(name);
  return contractObj ? contractObj.contract : undefined;
};

export const contractAddress = name => {
  const contractObj = contractObject(name);
  return contractObj ? contractObj.address : undefined;
};

export const validContract = async name => {
  const address = contractAddress(name);
  if (address) {
    return web3.eth
      .getCode(address)
      .then(
        code => (code === '0x0' || code === '0x' ? Promise.resolve(false) : Promise.resolve(true)),
      );
  }
  return Promise.resolve(false);
};

const getCurrentUser = async () => web3.eth.getAccounts().then(accounts => accounts[0]);

export let SmartContracts = [];
export let web3;
export let currentUser;

CONTRACT_DECLARATIONS;

const refreshContracts = async web3 =>
  web3.eth.net.getId().then(netId => {
    SmartContracts = [];
    CONTRACT_INSTANTIATION;
    return Promise.resolve(SmartContracts);
  });

export function injectWeb3() {
  web3 = getWeb3();

  const refreshUser = () =>
    getCurrentUser().then(account => {
      currentUser = account;
    });
  const refreshDapp = async () => Promise.all([refreshUser(), refreshContracts(web3)]);

  // Will refresh local store when new user is chosen:
  web3.currentProvider.publicConfigStore.on('update', refreshDapp);

  return refreshContracts(web3).then(refreshUser);
}
