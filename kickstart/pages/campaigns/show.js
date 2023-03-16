import React, { Component } from 'react';
import Layout from '../../components/Layout';
import campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
	static async getInitialProps(props) {
		const summary = await campaign(props.query.address).methods.getSummary().call();
		return {
			minimumContribution: summary['0'],
			balance: summary['1'],
			requestCount: summary['2'],
			approverCount: summary['3'],
			manager: summary['4'],
			address: props.query.address
		};
	}

	renderCards() {
		const items = [
			{
				header: this.props.manager,
				meta: 'Address of Manager',
				description: 'The manager created this campaign and can create requests to withdraw money',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: web3.utils.fromWei(this.props.balance, 'ether'),
				meta: 'Campaign Balance (ether)',
				description: 'This is money available for this campaign to spend',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: this.props.minimumContribution,
				meta: 'Minimum Contribution (wei)',
				description: 'You must contribute atleast this much wei to become a contributer',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: this.props.requestCount,
				meta: 'Request Count',
				description: 'A request tries to withdraw money from the contract. Request must be approved by contributers',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: this.props.approverCount,
				meta: 'Contributers Count',
				description: 'This is the number of contributors for this campaign- people who have donated to this campaign',
				style: { overflowWrap: 'break-word' }
			},
		];
		return <Card.Group items={items} />
	}

	render() {
		return(
			<Layout>
			 <h1>Campaign Details</h1>
			 <Grid>
			 	<Grid.Row>
				 	<Grid.Column width={10}>
					 {this.renderCards()}
					</Grid.Column>
					<Grid.Column width={6}>
					 <ContributeForm address={this.props.address} />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Link route={`/campaigns/${this.props.address}/requests`}>
							<a>
								<Button primary>View Requests</Button>
							</a>
						</Link>
					</Grid.Column>
				</Grid.Row>
			 </Grid>
			</Layout>
		);
	}
}
export default CampaignShow;