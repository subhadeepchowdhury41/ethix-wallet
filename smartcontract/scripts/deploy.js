const Web3 = require('web3');
const fs = require('fs');

const web3 = new Web3.HttpProvider("http://localhost:8545");

const contractJson = JSON.parse(fs.readFileSync('./build/contracts/Greetings.json', 'utf8'));

const abi = contractJson.abi;
const bytecode = contractJson.bytecode;

const contract = new web3.eth.Contract(abi);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    // const account = accounts[0];
    // const gas = await contract.deploy({ data: bytecode }).estimateGas();
    // const instance = await contract.deploy({ data: bytecode }).send({ from: account, gas: gas });
    // console.log('Contract deployed to', instance.options.address);
}