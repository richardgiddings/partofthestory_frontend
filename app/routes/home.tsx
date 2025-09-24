import type { Route } from './+types/home';
import { NavLink, useMatches } from 'react-router';
import { useNavigate } from 'react-router-dom';

// Bootstrap styling
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Part of The Story" },
    { name: "description", content: "Where will your story go?" },
  ];
}


export async function clientLoader({ 
	request,
}: Route.ClientLoaderArgs) {

	const api_url = import.meta.env.VITE_APP_BASE_URL + ":" + import.meta.env.VITE_APP_BASE_PORT;

	let story = null
	try {
		story = await fetch(api_url+"/random_complete_story/").then(res => res.json())
	}
	catch(err) {
		story = undefined
	}

	let user_status = null;
	try {
		user_status = await fetch(api_url+"/home/", {credentials: "include"}).then(res => res.json())
	}
	catch(err) {
		user_status = undefined // so we can still return the story
	}

	const [,searchParams] = request.url.split("?");
	const submitted = new URLSearchParams(searchParams).get("submit");

  	return {api_url, story, user_status, submitted};
}


export default function Home({
	loaderData,
}: Route.ComponentProps) {

	const navigate = useNavigate();
	const {api_url, story, user_status, submitted} = loaderData;

	const login_link = api_url + "/login/"

	let submitted_message = ""
	if(submitted) {
		submitted_message = "Story part submitted."
	}

	const user_name = user_status?.user?.user_name;
	//const formatted_date = 
	//	new Date(story?.date_complete).toLocaleDateString(
	//		"en-GB", { year: "numeric", month: "long", day: "numeric"});

  	return (
		<Container fluid>
			<Row>
				<Col>
					<Navbar>
						<Container fluid className="ms-0">
							<Navbar.Brand>
								{user_name !== undefined ?
								<small className="mb-40">Welcome {user_name}</small>
								: ""}
								<h1 className="parisienne-regular mt-2">Be part of the story</h1>
							</Navbar.Brand>
							<Nav>
								{user_name == undefined ?
								<NavLink to={login_link} end>
									<Button className="gsi-material-button">
										<div className="gsi-material-button-state"></div>
										<div className="gsi-material-button-content-wrapper">
											<div className="gsi-material-button-icon">
											<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
												<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
												<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
												<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
												<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
												<path fill="none" d="M0 0h48v48H0z"></path>
											</svg>
											</div>
											<span className="gsi-material-button-contents">Sign in with Google</span>
											<span style={{display: "none"}}>Sign in with Google</span>
										</div>
									</Button>
								</NavLink> : ""}
							</Nav>
						</Container>
					</Navbar>
				</Col>
			</Row>
			<Row>
				<Col>
					<Card bg="light" text="dark">
						{story == undefined ? 
						<Card.Body>
							No stories yet. Why not start one?
						</Card.Body> :
						<Card.Body>
							<Card.Title className="archivo-black-regular mb-3">
								<h4>{story.title}</h4>
							</Card.Title>
							{story.parts?.map((part: any) => (
								<Card.Text key={part.id}>{part.part_text}</Card.Text>
							))}
						</Card.Body>
						}
						<Card.Footer className="text-muted">
							<NavLink to="/about" end><Button>About</Button></NavLink>
							<Button onClick={() => navigate(".", { replace: true })} className="ms-1">Read Another Story</Button>
							 {user_name !== undefined ? <NavLink to="write/" end><Button className="ms-1">Write</Button></NavLink>: ""}
							 {user_name !== undefined ? <NavLink to="my_stories" end><Button className="ms-1">My Stories</Button></NavLink>: ""}
							 <div className="right text-muted mt-2">{submitted_message}</div>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
