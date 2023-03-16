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
	lottery = await new web3.eth.Contract(JSON.parse(interface))
	.deploy({data: bytecode})
	.send({from: accounts[0], gas: 1000000})

	lottery.setProvider(provider);
})

describe('Lottery contract', () => {
	
	it('deploys a contract', () =>{
		assert.ok(lottery.options.address)
	});

	it('enters a player with minimum entry fee', async () => {
		await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.02', 'ether')});
		const players = await lottery.methods.getPlayers().call({from: accounts[0]})
		assert.equal(1, players.length);
		assert.equal(accounts[0], players[0]);
	});

	it('allows multiple accounts to enter', async () => {
		await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.02', 'ether')});
		await lottery.methods.enter().send({from: accounts[1], value: web3.utils.toWei('0.02', 'ether')});
		await lottery.methods.enter().send({from: accounts[2], value: web3.utils.toWei('0.02', 'ether')});
		const players = await lottery.methods.getPlayers().call({from: accounts[0]})
		assert.equal(3, players.length);
		assert.equal(accounts[0], players[0]);
		assert.equal(accounts[1], players[1]);
		assert.equal(accounts[2], players[2]);
	});

	it('denies entry to a player with txn value < minimum entry fee', async () => {
		try {
			await lottery.methods.enter().send({from: accounts[0]});
			assert(false);
		} catch(err) {
			assert(err);
		}
		assert.equal('undefined', typeof lottery.getPlayers);
	});

	it('denies call to pick a winner if called by anyone other than the manager', async () => {
		try {
			const txn = await lottery.methods.pickWinner().send({from: accounts[1]});
			assert(false);
		} catch(err) {
			assert(err);
		}
	});

	it('sends money to winner, resets players array', async () => {
		const initBalance0 = await web3.eth.getBalance(accounts[1]);
		// console.log("balance before enterring the lottery:", initBalance0);
		await lottery.methods.enter().send({from: accounts[1], value: web3.utils.toWei('2', 'ether')});
		const initBalance = await web3.eth.getBalance(accounts[1]);
		// console.log("balance after entering the lottery:", initBalance);
		const contractBalance0 = await web3.eth.getBalance(lottery.options.address);
		assert.equal(web3.utils.toWei('2', 'ether'), contractBalance0);
		await lottery.methods.pickWinner().send({from: accounts[0]});
		const finalBalance = await web3.eth.getBalance(accounts[1]);
		// console.log("balance after winning the lottery:", finalBalance);
		assert.equal((BigInt(initBalance) + BigInt(web3.utils.toWei('2', 'ether'))).toString(), finalBalance);
		assert.equal('undefined', typeof lottery.getPlayers);
		const contractBalance = await web3.eth.getBalance(lottery.options.address);
		assert.equal("0", contractBalance);
	});
})
