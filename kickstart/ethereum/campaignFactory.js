import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0x9e23ad13533Bc529986F6b73243aCDcdBBbE2E17');

export default instance;
