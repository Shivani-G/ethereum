const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // capitalized as a constructor
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile')

const INITIAL_MSG = "Hi there";
let accounts;
beforeEach( async () => {
	// Get all accounts
	accounts = await web3.eth.getAccounts();

	// Use one of the accounts to deploy the contract
	inbox = await new web3.eth.Contract(JSON.parse(interface))
	.deploy({data: bytecode, arguments: [INITIAL_MSG]})
	.send({from: accounts[0], gas: 1000000})

	inbox.setProvider(provider);
})

describe('Inbox', () => {
	
	it('deploys a contract', () =>{
		assert.ok(inbox.options.address)
	});

	it('has a default message', async () => {
		const message = await inbox.methods.message().call();
		assert.equal(message, INITIAL_MSG);
	});

	it('updates message', async () => {
		const txn = await inbox.methods.setMessage("Bye there").send({from: accounts[0]});
		console.log(txn);
		const message = await inbox.methods.message().call();
		assert.equal(message, "Bye there");
	});
})
