import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Grid, Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
	
	static async getInitialProps(props) {
		const address = props.query.address;
		const campaignContract = campaign(address);
		const requestCount = await campaignContract.methods.getRequestsCount().call();
		const approversCount = await campaignContract.methods.approversCount().call();

		const requests = await Promise.all(
			Array(parseInt(requestCount)).fill().map((element, index) => {
				return campaignContract.methods.requests(index).call()
			})
		);
		console.log(requests);

		return { address, requests, requestCount, approversCount };
	}

	renderRow() {
		return this.props.requests.map((request, index) => {
			return (<RequestRow 
						request={request}
						key={index}
						id={index}
						address={this.props.address}
						approversCount={this.props.approversCount}
					/>
			);
		});
	}
	
	render() {
		const { Header, Row, HeaderCell, Body } = Table;
		return(
			<Layout>
				<Grid>
					<Grid.Row>
						<Grid.Column width={9}>
							<h1>Requests</h1>
						</Grid.Column>
						<Grid.Column width={1}>
							<Link route={`/campaigns/${this.props.address}/requests/new`} >
								<a><Button primary floated="right" style={{ marginBottom:10 }}>Add Request</Button></a>
							</Link>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>
							<HeaderCell>Description</HeaderCell>
							<HeaderCell>Amount</HeaderCell>
							<HeaderCell>Recipient</HeaderCell>
							<HeaderCell>Approval Count</HeaderCell>
							<HeaderCell>Approve</HeaderCell>
							<HeaderCell>Finalize</HeaderCell>
						</Row>
						{this.renderRow()}
					</Header>
					<Body>
					</Body>
				</Table>

			</Layout>
		);
	}
}
export default RequestIndex;