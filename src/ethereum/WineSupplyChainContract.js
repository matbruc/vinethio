import web3 from "./web3";

import wineSupplyChainContract from "@vinethio/build/contracts/WineSupplyChain.json";

export const createContract = async () =>  {
    const networkId = await web3.eth.net.getId();
    // Retrieve the Network configuration from truffle-config.js file
    const deployedNetwork = wineSupplyChainContract.networks[networkId];
    return new web3.eth.Contract(wineSupplyChainContract.abi, deployedNetwork.address);
}