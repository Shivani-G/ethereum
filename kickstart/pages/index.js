import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/campaignFactory';
import Layout from '../components/Layout';
import { Link } from '../routes';


class CampaignIndex extends Component {

	static async getInitialProps() {
		const campaignList = await factory.methods.getDeployedCampaigns().call();
		return {campaignList};
	}

	renderCampaigns() {
		const items = this.props.campaignList.map(x => {
			return {
				"header": x, 
				"description": <Link route={`/campaigns/${x}`}><a>View Campaign</a></Link>, "fluid": true}
		});
		return <Card.Group items = {items} />;
	}
	

	render() {
		return( 
			<Layout>
				<div>
					<h3>Open Campaigns</h3>
					<Link route="/campaigns/new">
						<a>
							<Button floated="right"
								content="Create Campaign"
								icon="add circle"
								primary
							/>
						</a>
					</Link>
					{this.renderCampaigns()}
				</div>
			</Layout>
		);
	}

}

export default CampaignIndex;
