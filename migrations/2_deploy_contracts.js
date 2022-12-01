let WineSupplyChain = artifacts.require("../contracts/WineSupplyChain.sol");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    await deployer.deploy(WineSupplyChain, accounts);
}