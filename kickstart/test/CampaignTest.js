const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // capitalized as a constructor
const provider = ganache.provider();
const web3 = new Web3(provider);
const compiledCampaign = require('../ethereum/build/Campaign.json')
const compiledFactory = require('../ethereum/build/CampaignFactory.json')

// test 1: create request- run by contract owner

// const INITIAL_MSG = "Hi there";
let accounts;
let campaignAddress;
let campaign;
let factory;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("assigns manager of contrace as contract creater", async () => {
  	let manager = await campaign.methods.manager().call();
  	assert.equal(manager, accounts[0])
  });

  it("ensures that one can contribute to the campaign", async () => {
  	await campaign.methods.contribute().send({from: accounts[1], value: '101'})
  	const contractBalance = await web3.eth.getBalance(campaignAddress);
  	assert.equal(contractBalance, '101');
  	let isContributerPresent = await campaign.methods.approvers(accounts[1]).call();
  	assert(isContributerPresent);
  });

  it("requires a minimum contribution", async () => {
  	try {
  		await campaign.methods.contribute().send({from: accounts[1], value: '100'});
  		assert(false);
  	} catch(err) {
		assert(err);
  	}
  });

  it('allows manager to create a new request', async () => {
  		let user = accounts[0];
  		let manager = await campaign.methods.manager().call();;
  		assert.equal(manager, user);
		await campaign.methods.createRequest("test request description", 100, accounts[2]).send({from: accounts[0], gas: '1000000'});
		const request = await campaign.methods.requests(0).call();
		// console.log(request);
		assert(request);
	});

  it('allows valid transfer of money to request recipient after approval from > half the approvers', async () => {
  	await campaign.methods.contribute().send({from: accounts[1], value: web3.utils.toWei('5', 'ether')});
  	await campaign.methods.contribute().send({from: accounts[2], value: web3.utils.toWei('5', 'ether')});
  	await campaign.methods.contribute().send({from: accounts[3], value: web3.utils.toWei('5', 'ether')});
  	
  	await campaign.methods.createRequest("test request description", web3.utils.toWei('5', 'ether'), accounts[4]).send({from: accounts[0], gas: '1000000'});
  	
  	await campaign.methods.approveRequest(0).send({from: accounts[1], gas: '1000000'});
  	await campaign.methods.approveRequest(0).send({from: accounts[2], gas: '1000000'});

  	await campaign.methods.finalizeRequest(0).send({from: accounts[0], gas: '1000000'});

  	const balance = await web3.eth.getBalance(accounts[4]);
  	// console.log(balance)
  	assert.equal(105, parseFloat(web3.utils.fromWei(balance, 'ether')))


  })
});

	

	// // test: create a new request by someone who is not the owner

	// it('Approve a request', async () => {
	// 	await campaign.methods.createRequest().send({from: accounts[0], value: "test request description", 0, accounts[1]});
	// 	await campaign.methods.approveRequest().send({from: accounts[0], value: 0});
	// 	const requests = await campaign.methods.requests().call({from: accounts[0]})
	// 	assert.equal(1, requests.length);
	// 	assert.equal(accounts[0], requests[0]);
	// });

