import type { Route } from './+types/write';
import { useState } from 'react';
import { NavLink, redirect, Form } from 'react-router';

// Bootstrap styling
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormText from 'react-bootstrap/FormText';
import 'bootstrap/dist/css/bootstrap.min.css';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Be Part of The Story" },
    { name: "description", content: "Where will your story go?" },
  ];
}


export async function clientLoader() {

	const api_url = import.meta.env.VITE_APP_URL;

    let user_status = null;
    try {
    	user_status = await fetch(api_url+"/home/", {credentials: "include"}).then(res => res.json())
    }
    catch(err) {
		console.log(err)
    }

	if (user_status.detail && user_status.detail == "Session expired. Please login again.") {
		throw redirect("/");
	}

	const part = await fetch(api_url+"/get_part/", {credentials: "include"}).then(res => res.json())

	var message = ""
    var prev_part_text = ""
    if(part.part_number > 1) {
        const prev_part = await fetch(api_url+"/get_previous_part/", {credentials: "include"}).then(res => res.json())
        prev_part_text = prev_part.part_text.substr(prev_part.part_text.length - 200)
    } 
	else {
		message = "Hey, you get to think of a title too!"
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
			const result = await fetch(`${api_url}/save_part/${part_id}`, {
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
								}).then((res) => res.json())

			if (result.status >= 200 && result.status <= 299) {
				return "Story Saved."
			}

			if(result.results.length > 0) {
				let bad_words = ""
				for (let i = 0; i < result.results.length; i++) {
					bad_words = bad_words + result.results[i].word + " "
				}
				return "Story wasn't saved due to these words: " + bad_words
			}

			return "Something went wrong."
		}
		catch(err) {
			console.log(err)
		}
	}
	else if (action == "submit") {
		const result = await fetch(`${api_url}/complete_part/${part_id}`, {
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
								}).then((res) => res.json())
		
		if (result.status >= 200 && result.status <= 299) {
			return redirect("/?submit=1");
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
		throw redirect("/index.html");
	}
	const user_name = user_status?.user?.user_name;

	const [count, setCount] = useState(part?.part_text?.length);
	const part_number = part.part_number;

  	return (
		<Container fluid>
			<Row>
				<Col>
					<Navbar>
						<Container className="ms-0">
							<Navbar.Brand>
								<small className="mb-40">{user_name}</small>
								<h1 className="parisienne-regular mt-2">Be part of the story</h1>
							</Navbar.Brand>
						</Container>
					</Navbar>
				</Col>
			</Row>
			<Row>
				<Col>
					<Card bg="light" text="dark">
						<Card.Header>
							<small className="text-muted">You are writing part {part_number} of 5.</small>
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
										required />
									<FormText className="text-muted">
									{message}
									</FormText>
								</FormGroup> 
								: <h3 className="archivo-black-regular">{part_number > 1 ? (typeof part.story.title === "string" ? part.story.title : JSON.stringify(part.story.title)) : ""}</h3>}
								<FormGroup className="mb-3" controlId="formPartText">
									<FormLabel>
										{part_number > 1 ? 
										<div>
										<b>The end of the previous part was: </b>
										<p className="wrap_text">{typeof prev_part_text === "string" ? prev_part_text : JSON.stringify(prev_part_text)}</p>
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
										onChange={e => setCount(e.target.value.length)} 
										required/>
									<FormText id="partTextHelpBlock" muted>Minimum of 50 characters and a maximum of 1000 characters. {count} used so far.</FormText>
									<FormControl name="part_id" type="hidden" value={part.id} />
									<FormControl name="api_url" type="hidden" value={api_url} />
								</FormGroup>								
								<ButtonGroup aria-label="Save and Submit buttons" className="right">
									<Button name="action" value="save" type="submit">Save</Button>
									<Button name="action" value="submit" type="submit">Submit</Button>
								</ButtonGroup>
							</Form>
						</Card.Body>
						<Card.Body>
							<Card.Text className="right">
								{actionData ? actionData : ""}
							</Card.Text>
						</Card.Body>
						<Card.Footer>
							<NavLink to="/" end><Button className="me-1">Home</Button></NavLink>
							<NavLink to="/my_stories" end><Button className="ms-1">My Stories</Button></NavLink>				
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
