import type { Route } from './+types/introduction';
import { useNavigate } from 'react-router-dom';

// Bootstrap styling
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Be Part of The Story" },
		{ name: "description", content: "Write stories with other people and enjoy the creations." },
	];
}

export default function Introduction() {

    const navigate = useNavigate();

  	return (
        <Container className="intro-screen">
            <Row>
				<Col className="mt-3 block-temp">
					<h1 className="parisienne-regular mt-2 mb-0">Be part of the story</h1>
				</Col>
			</Row>
			<Row>
				<Col className="mt-3">
                    <p>Did you ever play that game where you took it in turns to draw part of a picture. Each time you drew a part you folded the paper over and the next person only saw the end of your picture. At the end you laughed at your weird creation. Well...</p>
                    <p>Write a story with other people. Every story has five parts. You are randomly assigned a part from an unfinished story when you choose to write. To help you some of the end of the previous part is shown to you along with the title of the story. If you are writing the first part you get to decide the story title too. Once the last part is complete the story is published for everyone to see.</p>
                    <p>What is your story?</p>
				</Col>
			</Row>
            <Row>
				<Col className="mt-1">
                    <Button aria-label="Go to home page" onClick={() => navigate("home", { replace: true })}>Ok, let's go!</Button>
                </Col>
            </Row>
        </Container>
	);
}
