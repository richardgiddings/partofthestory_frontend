import type { Route } from './+types/my_stories';
import { NavLink, redirect } from 'react-router';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// Bootstrap styling
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Be Part of The Story" },
    { name: "description", content: "Where will your story go?" },
  ];
}


export async function clientLoader() {

	const api_url = import.meta.env.VITE_APP_URL;

	const user = await fetch(api_url+"/home/", {credentials: "include"}).then((res) => res.json())

	if (user.detail && user.detail == "Session expired. Please login again.") {
		return redirect("/index.html");
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
			const user = await fetch(api_url+"/home/", {credentials: "include"}).then((res) => res.json())
			if (user.detail && user.detail == "Session expired. Please login again.") {
				navigate("/");
				return false;
			}

			const res = await fetch(api_url+pagination, {credentials: "include"}).then((res) => res.json())

			setStories(res.items);

			// set pagination links
			setFirstLink(res.links.first);
			setLastLink(res.links.last);
			setPreviousLink(res.links.prev);
			setNextLink(res.links.next);
			setNumberOfStories(res.total);
		}
		catch(err) {
			console.log(err);
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
							<Row>
								<Col>
									<Navbar.Brand>
										{user_name !== undefined ?
										<small className="mb-40">Welcome {user_name}</small>
										: ""}
										<h1 className="parisienne-regular mt-2">Be part of the story</h1>
									</Navbar.Brand>
								</Col>
							</Row>
							<Row>
								<Col>
									<Pagination className="pb-0">
										{first_link && <Pagination.First onClick={() => fetchStories(first_link) } /> }
										{previous_link && <Pagination.Prev onClick={() => fetchStories(previous_link) } /> }
										{next_link && <Pagination.Next onClick={() => fetchStories(next_link) } /> }
										{last_link && <Pagination.Last onClick={() => fetchStories(last_link) } /> }
									</Pagination>
								</Col>
							</Row>
						</Container>
					</Navbar>
				</Col>
			</Row>
			<Row>
				<Col>
					{stories && stories.length ? 
					<Card bg="light" text="dark">	
						<Card.Body>
							<Card.Title className="pb-2"><small>You have contributed to {number_of_stories} stories (your parts are in <b>bold</b>)</small></Card.Title>
							<Accordion defaultActiveKey="0">
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
							<Container className="pb-0" fluid>
								<Row>
									<Col>
										<NavLink to="/index.html" end><Button>Home</Button></NavLink>
									</Col>
								</Row>					
							</Container>
						</Card.Footer>
					</Card>
					:
					<Card bg="light" text="dark">
						<Card.Body>
							You haven't told any stories yet. Why not start today?
						</Card.Body>
						<Card.Footer>
							<Container fluid>
								<Row>
									<Col>
										<NavLink to="/index.html" end><Button>Home</Button></NavLink>
									</Col>
								</Row>					
							</Container>
						</Card.Footer>
					</Card>
					}
				</Col>
			</Row>
		</Container>				
	);
}
