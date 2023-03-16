const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');
const provider = new HDWalletProvider(
	'price say salad goat primary sand airport harbor route coast story parade',
	'https://rinkeby.infura.io/v3/98a7da55e5b6422e9aa5d0942a39eed0'
);
const web3 = new Web3(provider);

const deploy = async () => {
	accounts = await web3.eth.getAccounts();
	console.log('Attempting to deploy from account:', accounts[0]);

	const result = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({data: bytecode, arguments: ['Hi there!']})
		.send({gas: '1000000', from: accounts[0]});
	console.log('Contract deployed to:', result.options.address);
}
deploy();
