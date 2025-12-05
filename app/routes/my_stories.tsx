import type { Route } from './+types/my_stories';
import { redirect } from 'react-router';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// Bootstrap styling
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
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
				<Col className="ms-1 mt-3">
					{user_name !== undefined ?
					<span>{user_name}</span>
					: ""}
					<h1 className="parisienne-regular mt-2 mb-0">Be part of the story</h1>
				</Col>
			</Row>
			<Row>
				<Col>
					<Navbar>
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
						</Card.Body>
						<Card.Footer>
							<Pagination aria-label="Story pagination" className="mb-0" data-intro="Only a certain number of stories are shown at once. Use these buttons to see more." data-step="2">
								{first_link && 
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-first">First page</Tooltip>}>
										<Pagination.First aria-label="First page" onClick={() => fetchStories(first_link) } /> 
									</OverlayTrigger>
								}
								{previous_link &&
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-previous">Previous page</Tooltip>}> 
										<Pagination.Prev aria-label="Previous page" onClick={() => fetchStories(previous_link) } />
									</OverlayTrigger> 
								}
								{next_link && 
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-next">Next page</Tooltip>}> 
										<Pagination.Next aria-label="Next page" onClick={() => fetchStories(next_link) } />
									</OverlayTrigger>  
								}
								{last_link && 
									<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-page-last">Last page</Tooltip>}>
										<Pagination.Last aria-label="Last page" onClick={() => fetchStories(last_link) } /> 
									</OverlayTrigger>	
								}
							</Pagination>
						</Card.Footer>
					</Card>
					:
					<Card bg="light" text="dark">
						<Card.Body data-intro="Where the completed stories you have contributed to appear." data-step="1">
							This is where completed stories that you have contributed to will appear.
						</Card.Body>
					</Card>
					}
				</Col>
			</Row>
		</Container>				
	);
}
