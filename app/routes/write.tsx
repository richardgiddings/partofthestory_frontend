import type { Route } from './+types/write';
import { useState } from 'react';
import { redirect, Form } from 'react-router';
import ReactRouterPrompt from 'react-router-prompt';

// Bootstrap styling
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormText from 'react-bootstrap/FormText';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

// JS Tour
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import 'intro.js/themes/introjs-modern.css';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Be Part of The Story" },
    { name: "description", content: "Where will your story go?" },
  ];
}


export async function clientLoader() {

	const api_url = import.meta.env.VITE_APP_URL;

    let user_status = null;
	let part = null
	let message = "";
    let prev_part_text = "";

    try {
    	const user_response = await fetch(api_url+"/user/", {credentials: "include"})
		if (!user_response.ok) {
			return redirect("/");
		}
		user_status = await user_response.json();

		const part_response = await fetch(api_url+"/get_part/", {credentials: "include"})
		part = await part_response.json();

		if(part.part_number > 1) {
			const prev_part_response = await fetch(api_url+"/get_previous_part/", {credentials: "include"})
			const prev_part = await prev_part_response.json();
			prev_part_text = prev_part.part_text.substr(prev_part.part_text.length - 200)
		} 
		else {
			message = "Hey, you get to think of a title too!"
		}
	}
    catch(error) {
		console.log('There was an error', error);
    }

  	return {api_url, part, prev_part_text, user_status, message};
}


export async function clientAction({
  request
}: Route.ClientActionArgs) {

	let formData = await request.formData();

	let story_title = formData.get("story_title");
	let part_text = formData.get("part_text");
	let part_id = formData.get("part_id");
	let api_url = formData.get("api_url");
	let action = formData.get("action");

	if(action == "save"){
		try {
			const save_response = await fetch(`${api_url}/save_part/${part_id}`, {
									method: "PATCH",
									headers: { 
										"Content-Type": "application/json"
									},
									credentials: "include",
									body: JSON.stringify(
										{ 
											story_title: story_title,
											part_text: part_text
										}
									)
								})
			const result = await save_response.json();
			if (result.status >= 200 && result.status <= 299) {
				return "Story Saved";
			}

			if(result.results.length > 0) {
				let bad_words = "";
				for (let i = 0; i < result.results.length; i++) {
					bad_words = bad_words + result.results[i].word + " "
				}
				return "Story wasn't saved due to these words: " + bad_words;
			}

			return "Something went wrong."
		}
		catch(error) {
			console.log('There was an error', error);
		}
	}
	else if (action == "submit") {
		try {
			const submit_response = await fetch(`${api_url}/complete_part/${part_id}`, {
										method: "PATCH",
										headers: { 
											"Content-Type": "application/json"
										},
										credentials: "include",
										body: JSON.stringify(
											{
												story_title: story_title,
												part_text: part_text
											}
										)
									})
			const result = await submit_response.json();
			if (result.status >= 200 && result.status <= 299) {
				return redirect("/?message=Story part submitted");
			}

			if(result.results.length > 0) {
				let bad_words = ""
				for (let i = 0; i < result.results.length; i++) {
					bad_words = bad_words + result.results[i].word + " "
				}
				return "Story wasn't saved due to these words: " + bad_words
			}
			
			return "Something went wrong..."
		}
		catch(error) {
			console.log('There was an error', error);
		}
	}
	else {
		return "Invalid action: " + action
	}
}


export default function Write({
	actionData,
	loaderData
}: Route.ComponentProps) {

	const {api_url, part, prev_part_text, user_status, message} = loaderData;

	if(!user_status) {
		throw redirect("/");
	}
	const user_name = user_status?.user?.user_name;

	const [count, setCount] = useState(part?.part_text?.length);
	const part_number = part.part_number;

	// Have there been changes to the form?
	const [isDirty, setIsDirty] = useState(false);

  	return (
		<Container fluid>
			<Row>
				<Col>
					<Navbar>
						<Container className="ms-0">
							<Navbar.Brand href="/">
								<small className="mb-40">{user_name}</small>
								<h1 className="parisienne-regular mt-2 mb-0">Be part of the story</h1>
							</Navbar.Brand>
						</Container>
					</Navbar>
				</Col>
			</Row>
			<Row>
				<Col>
					<Nav>
						<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-home">Go to home page</Tooltip>}>
							<Nav.Link href="/" className="pt-0">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
									<path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
								</svg>
								<span className="button_text">Home</span>
							</Nav.Link>
						</OverlayTrigger>
						<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-tour">What's on this page?</Tooltip>}>
							<Nav.Link href="" onClick={() => introJs.tour().start() } className="pt-0">
								<span className="button_text">Take a Tour</span>
							</Nav.Link>
						</OverlayTrigger>	
					</Nav>
				</Col>
			</Row>
			<Row>
				<Col>
					<Card bg="light" text="dark">
						<Card.Header>
							<small className="text-muted" data-intro="The part you will be writing." data-step="1">You are writing part {part_number} of 5.</small>
						</Card.Header>
						<Card.Body>
							<Form method="post">
								{part_number == 1 ? 
								<FormGroup className="mb-3" controlId="formTitle">
									<FormLabel>Story Title</FormLabel>
									<FormControl 
										name="story_title" 
										type="text"
										minLength={2} 
										maxLength={50} 
										defaultValue={typeof part.story.title === "string" ? part.story.title : JSON.stringify(part.story.title)}
										required 
										data-intro="The story title." data-step="2" 
										onChange={
											() => setIsDirty(true)
										}/>
									<FormText className="text-muted">
									{message}
									</FormText>
								</FormGroup> 
								: <h2 className="archivo-black-regular" data-intro="The story title." data-step="2">{part_number > 1 ? (typeof part.story.title === "string" ? part.story.title : JSON.stringify(part.story.title)) : ""}</h2>}
								<FormGroup className="mb-3" controlId="formPartText">
									<FormLabel>
										{part_number > 1 ? 
										<div>
										<b>The end of the previous part was: </b>
										<p className="wrap_text" data-intro="The end of the previous part to help you continue the story." data-step="3">{typeof prev_part_text === "string" ? prev_part_text : JSON.stringify(prev_part_text)}</p>
										<b>Continue the story with your part here:</b>
										</div>
										:
										<div>
										<b>Start your story here:</b>
										</div>
										}
									</FormLabel>
									<FormControl 
										name="part_text"
										as="textarea" 
										rows={10} 
										minLength={50} 
										maxLength={1000} 
										defaultValue={typeof part.part_text === "string" ? part.part_text : JSON.stringify(part.part_text)}
										onChange={
											e => {
												setCount(e.target.value.length)
												setIsDirty(true)
											}
										} 
										required
										placeholder="Write your part here. If there is a previous part have a look at what was written for ideas on how to start yours. Maybe include the title somehow in your part of the story."
										data-intro="Write your part here." data-step="4" />
									<FormText id="partTextHelpBlock" muted>Minimum of 50 characters and a maximum of 1000 characters. {count} used so far.</FormText>
									<FormControl name="part_id" type="hidden" value={part.id} />
									<FormControl name="api_url" type="hidden" value={api_url} />
									<ReactRouterPrompt when={isDirty}>
										{({ isActive, onConfirm, onCancel } : { isActive:any, onConfirm:any, onCancel:any }) => (
											<Modal show={isActive}>
												<Modal.Header>
													<Modal.Title>Leave without saving?</Modal.Title>
												</Modal.Header>
												<Modal.Body>
													<Button aria-label="No" variant="secondary" onClick={onCancel} className="me-1">No</Button>
													<Button aria-label="Yes" onClick={onConfirm}>Yes</Button>
												</Modal.Body>
											</Modal>
										)}
									</ReactRouterPrompt>
								</FormGroup>								
								<ButtonGroup aria-label="Save and Submit buttons" className="right">
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-save">Save the part</Tooltip>}>
										<Button 
											aria-label="Save" 
											name="action" value="save" type="submit" 
											data-intro="Save if you just want to come back to it later." data-step="5" 
											onClick={()=>{setIsDirty(false)}}>Save</Button>
									</OverlayTrigger>
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-submit">Submit the part</Tooltip>}>
										<Button 
											aria-label="Submit" 
											name="action" value="submit" type="submit" 
											data-intro="Submit your part when you are finished." data-step="6"
											onClick={()=>{setIsDirty(false)}}>Submit</Button>
									</OverlayTrigger>
								</ButtonGroup>
							</Form>
						</Card.Body>
						<Card.Footer>
							<span className="right">{actionData ? actionData : ""}</span>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
