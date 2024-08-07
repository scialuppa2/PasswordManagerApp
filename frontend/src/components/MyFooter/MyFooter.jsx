import { Row, Col } from "react-bootstrap";
import './MyFooter.css';

const MyFooter = () => (
    <footer className="footer">
        <Row className="text-center">
            <Col xs={{ span: 6, offset: 3 }}>
                <Row>
                    <Col xs={12} className="text-left copyright">
                        © GuardianPass - {new Date().getFullYear()} Fabrizio D'Alessandro
                    </Col>
                </Row>
            </Col>
        </Row>
    </footer>
);

export default MyFooter;