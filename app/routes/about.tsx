import type { Route } from './+types/about';
import { NavLink, Link } from 'react-router';

// Bootstrap styling
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Be Part of The Story" },
		{ name: "description", content: "Where will your story go?" },
	];
}


export async function clientLoader() {

	const api_url = import.meta.env.VITE_APP_URL;

	const response = await fetch(api_url+"/user/", {credentials: "include"})
	const user_status = await response.json();

  	return user_status;
}


export default function About({
	loaderData,
}: Route.ComponentProps) {

    const user_status = loaderData;
    const user_name = user_status?.user?.user_name;
	const contact_email = import.meta.env.VITE_APP_EMAIL

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
                    <Card>
                        <Card.Body>
                            <h4>Blurb</h4>
                            <p>Did you ever play that game where you took it in turns to draw part of a picture. Each time you drew a part you folded the paper over and the next person only saw the end of your picture. At the end you laughed at your weird creation. Well...</p>
                            <p>Write a story with other people. Every story has five parts. You are randomly assigned a part from an unfinished story when you choose to write. To help you some of the end of the previous part is shown to you along with the title of the story. If you are writing the first part you get to decide the story title too. Once the last part is complete the story is published for everyone to see.</p>
                            <p>What is your story?</p>

                            <h4>How does it work?</h4>
                            <p>If you are not logged in:</p>
                            <ul>
                                <li>You can see a random story from the list of completed stories created by other users. <b>Get Random Story</b> gets you another</li>
                                <li>You can login using your Google ID to unlock the ability to contribute to stories</li>
                            </ul>
                            <p>Logging in to create stories:</p>
                            <ul>
                                <li>Login using your Google account</li>
                                <li>When you select <b>Write</b> you are assigned a random unassigned part from a story. Write your part then either <b>Save</b> it to come back to it later or <b>Submit</b> it when you are finished</li>
                                <li>Choose <b>My Stories</b> to see the completed stories you have contributed to. The part(s) you wrote will be highlighted</li>
                            </ul>
                            <h4>Data we collect</h4>
                            <p>The only information of yours we store is your Google user id, which is used to identify the stories you contributed to. A session cookie stores your Google login so you can use the parts of the site that need you to be logged in.</p>
							<h4>Moderating the stories</h4>
							<p>We try to stop bad words from appearing on the website, but no system is perfect. If you think that a word has been unfairly identified stopping you from submitting your part of a story or you think that a story or part of a story should not be shown on the site <a href={`mailto:${typeof contact_email === "string" ? contact_email : ""}`}>get in touch</a>.</p>
						</Card.Body>
                        <Card.Footer>
                            <NavLink to="/" end>
								<Button className="me-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
										<path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
									</svg>
								</Button>
							</NavLink>			
                        </Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
