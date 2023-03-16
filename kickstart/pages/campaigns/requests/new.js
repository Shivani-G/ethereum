import React, { Component } from 'react';
import Layout from '../../../components/Layout'
import { Form, Button, Message, Input } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import campaign from '../../../ethereum/campaign';
import { Router, Link } from '../../../routes';

class RequestNew extends Component {
	state = {
		value : "",
		description : "",
		recipient : "",
		loading : false,
		errorMessage : ""
	}

	static async getInitialProps(props) {
		return {
			address: props.query.address
		};
	}

	onSubmit = async (event) => {
		event.preventDefault();
		this.setState({ loading : true, errorMessage: "" });
		try {
			const accounts = await web3.eth.getAccounts();
			await campaign(this.props.address).methods
				.createRequest(
					this.state.description, 
					web3.utils.toWei(this.state.value, 'ether'), 
					this.state.recipient
				)
				.send({from: accounts[0]});
			Router.pushRoute(`/campaigns/${this.props.address}/requests`);
		} catch(err) {
			this.setState({ errorMessage: err.message })
		}
		this.setState({ loading : false });
	}

	
	render() {
		return(
			<Layout>
				<Link route={`/campaigns/${this.props.address}/requests`}><a>Back</a></Link>
				<h1>Create a Request</h1>
				<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
					<Form.Field>
					 	<label>Description</label>
					 	<Input 
					 		value={this.state.description} 
					 		onChange={event =>{
					 			this.setState({ description : event.target.value });
					 		}}/>
					</Form.Field>
					<Form.Field>
					 	<label>Value in Ether</label>
					 	<Input 
					 		value={this.state.value} 
					 		onChange={event =>{
					 			this.setState({ value : event.target.value });
					 		}}/>
					</Form.Field>
					<Form.Field>
					 	<label>Recipient</label>
					 	<Input 
					 		value={this.state.recipient} 
					 		onChange={event =>{
					 			this.setState({ recipient : event.target.value });
					 		}}/>
					</Form.Field>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<Button loading = {this.state.loading} primary>Create</Button>

				</Form>
			</Layout>
		);
	}
}
export default RequestNew;