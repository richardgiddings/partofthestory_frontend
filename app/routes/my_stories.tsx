import type { Route } from './+types/my_stories';
import { NavLink, redirect } from 'react-router';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// Bootstrap styling
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Pagination from 'react-bootstrap/Pagination';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
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
	let user = null;

	try {
		const response = await fetch(api_url+"/user/", {credentials: "include"});

		if (!response.ok) {
			return redirect("/");
		}
		user = await response.json();
	}
	catch(error) {
		console.log('There was an error', error);
		return redirect("/");
	}

	return {api_url, user};
}


export default function MyStories({
	loaderData
}: Route.ComponentProps) {

	const navigate = useNavigate();

	const {api_url, user} = loaderData;

	const [stories, setStories] = useState([]);

	// set pagination links
	const [first_link, setFirstLink] = useState([]);
	const [last_link, setLastLink] = useState([]);
	const [previous_link, setPreviousLink] = useState([]);
	const [next_link, setNextLink] = useState([]);
	const [number_of_stories, setNumberOfStories] = useState<number>(0);

	const my_user_id = user.user_id;
	const user_name = user.user.user_name;

	const fetchStories = async (pagination: any) => {

		try {
			const response = await fetch(api_url+pagination, {credentials: "include"})

			if (!response.ok) {
				navigate("/");
				return;
			}
			const stories = await response.json();

			setStories(stories.items);

			// set pagination links
			setFirstLink(stories.links.first);
			setLastLink(stories.links.last);
			setPreviousLink(stories.links.prev);
			setNextLink(stories.links.next);
			setNumberOfStories(stories.total);
		}
		catch(error) {
			console.log('There was an error', error);
			navigate("/");
			return;
		}
	}


	useEffect(() => {
		fetchStories('/my_stories');
	}, []);


	return (
		<Container fluid>
			<Row>
				<Col>
					<Navbar>
						<Container fluid className="ms-0">
							<Navbar.Brand>
								{user_name !== undefined ?
								<small className="mb-40">{user_name}</small>
								: ""}
								<h1 className="parisienne-regular mt-2">Be part of the story</h1>
							</Navbar.Brand>
						</Container>
					</Navbar>
				</Col>
			</Row>
			<Row>
				<Col>
					{stories && stories.length ? 
					<Card bg="light" text="dark">	
						<Card.Body>
							<Card.Title className="pb-2">
								<small>You have contributed to {number_of_stories} {number_of_stories > 1 ? "stories" : "story"} (your parts are in <b>bold</b>)</small>
							</Card.Title>
							<Accordion defaultActiveKey="0" data-intro="Where the completed stories you have contributed to appear." data-step="1">
							{stories?.map((story: any) => (
								<Accordion.Item eventKey={story.id} key={story.id}>
									<Accordion.Header className="archivo-black-regular">{typeof story.title === "string" ? story.title : JSON.stringify(story.title)}</Accordion.Header>
									<Accordion.Body>
									{story?.parts.sort((a: any,b: any) => (a.part_number > b.part_number) ? 1 : ((b.part_number > a.part_number) ? -1 : 0)).map((part: any) => (
										<div key={part.id}>
										{part.user_id === my_user_id ? (
											<p><b>{typeof part.part_text === "string" ? part.part_text : JSON.stringify(part.part_text)}</b></p>
										) : (
											<p>{typeof part.part_text === "string" ? part.part_text : JSON.stringify(part.part_text)}</p>
										)}
										</div>
									))}
									</Accordion.Body>
								</Accordion.Item>
							))}
							</Accordion>
							<Pagination className="pt-4 mb-0" data-intro="Only a certain number of stories are shown at once. Use these buttons to see more." data-step="2">
								{first_link && 
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-first">First page</Tooltip>}>
										<Pagination.First onClick={() => fetchStories(first_link) } /> 
									</OverlayTrigger>
								}
								{previous_link &&
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-previous">Previous page</Tooltip>}> 
										<Pagination.Prev onClick={() => fetchStories(previous_link) } />
									</OverlayTrigger> 
								}
								{next_link && 
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-next">Next page</Tooltip>}> 
										<Pagination.Next onClick={() => fetchStories(next_link) } />
									</OverlayTrigger>  
								}
								{last_link && 
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-last">Last page</Tooltip>}>
										<Pagination.Last onClick={() => fetchStories(last_link) } /> 
									</OverlayTrigger>	
								}
							</Pagination>	
						</Card.Body>
						<Card.Footer>
							<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-tour">Page Tour</Tooltip>}>
								<Button onClick={() => introJs.tour().start() } className="me-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
										<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
									</svg>
								</Button>
							</OverlayTrigger>
							<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-home">Go to home page</Tooltip>}>
								<NavLink to="/" end>
									<Button>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
											<path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
										</svg>
									</Button>
								</NavLink>
							</OverlayTrigger>
						</Card.Footer>
					</Card>
					:
					<Card bg="light" text="dark">
						<Card.Body data-intro="Where the completed stories you have contributed to appear." data-step="1">
							This is where completed stories that you have contributed to will appear.
						</Card.Body>
						<Card.Footer>
							<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-tour">Page Tour</Tooltip>}>
								<Button onClick={() => introJs.tour().start() } className="me-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
										<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
									</svg>
								</Button>
							</OverlayTrigger>
							<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-home">Go to home page</Tooltip>}>
								<NavLink to="/" end>
									<Button>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
											<path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
										</svg>
									</Button>
								</NavLink>
							</OverlayTrigger>
						</Card.Footer>
					</Card>
					}
				</Col>
			</Row>
		</Container>				
	);
}
