import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Footer() {
  	return (
        <Navbar className="justify-content-end me-1 pt-0">
            <Navbar.Text>
                View my code on <a href="https://github.com/richardgiddings" target="_blank">GitHub</a>
            </Navbar.Text>
        </Navbar>
	);
}