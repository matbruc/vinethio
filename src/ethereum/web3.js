import Web3 from "web3";
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:7545'));


export default web3;