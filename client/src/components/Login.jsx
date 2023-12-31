import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import { Container, Row, Col } from "react-bootstrap";
import './Login.css';
import { getDatabase, get, ref, child } from "firebase/database"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB3uBQQjemaS87oKxxZXuk8ZKB59OeqQeU",
  authDomain: "react-auth-1c49e.firebaseapp.com",
  projectId: "react-auth-1c49e",
  storageBucket: "react-auth-1c49e.appspot.com",
  messagingSenderId: "237217792286",
  appId: "1:237217792286:web:43c5b48719d6b1da84c90f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbref = ref(db);

const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();
  const url = 'https://miro.medium.com/v2/resize:fit:1400/1*57BSpJqbnKSAF7t7CHAfTA.jpeg';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);

      Notification.requestPermission().then(perm => {
        if(perm === "granted") {
          const notification = new Notification("You are logged IN" , {
            data: {hello: "Logged IN"},
            icon: "fire.png"
          })
        }
      })

      const userRef = child(dbref, 'users/' + name);

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const user = snapshot.val();
          console.log("User data:", user);

          console.log(user.userName);
          localStorage.setItem("user-info", JSON.stringify({
            username: user.userName,
            email: user.email,
            role: user.role
          }));

          if(user.role === "professor")
          {
            navigate("/relation");
          }
          else
          {
            navigate("/download")
          }
        } else {
          console.log("Data does not exist at the specified path.");
        }
      }).catch((error) => {
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
      });


    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (

    <>
      <body style={{
        margin: 0,
        padding: 0,
        backgroundImage: 'url("https://miro.medium.com/v2/resize:fit:1400/1*57BSpJqbnKSAF7t7CHAfTA.jpeg")',
        position: 'absolute',
        backgroundSize: 'cover',
        // background: 'rgba(255, 255, 255, 0.7)',
        backgroundrepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        alignItems: 'center',
        height: '100%'

      }}>



        <Container style={{
          width: "500px",
          height: "500px",
          // backgroundColor: "#fafafa",
          background: 'rgba(255, 255, 255, 0.7)',
          margin: 'auto',
          borderRadius: '15px',


          // height: '7',
        }}>
          <Row style={{
            width: "410px",
            // backgroundColor: "#fafafa",
            background: 'rgba(255, 255, 255, 0.7)',
            margin: 'auto',
            // right: '10%',
            borderRadius: '15px',


            // height: '7',
          }}>
            <Col style={{
              // margin: 'auto',
              right: '50px',

            }}>
              <nav className="navbar bg-body-tertiary" style={{ 
                        margin: 'auto',
                        // right: '10%',

          }}>
                <div className="container-fluid" style={{ 
                        margin: 'auto',
                        // right: '10%',

          }}>
                  <a className="navbar-brand" href="/" style={{ 
                        margin: 'auto',
                        // right: '10%',

          }}>
                    {/* <img src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="30" height="24" className="d-inline-block align-text-top" /> */}
                    {/* Bootstrap */}
                  </a>
                </div>
              </nav>
              <div className="p-4 box" style={{ 
                        margin: 'auto',
                        // right: '10%',

          }} >
                <h2 className="mb-3" >Firebase Auth Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} style={{ 
                        margin: 'auto',
                        // right: '10%',

          }}>
                  <Form.Group className="mb-3" controlId="formBasicEmail" style={{ 
                        margin: 'auto',
                        // right: '10%',

          }}>
                    <Form.Control
                      type="email"
                      placeholder="Email address"
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail" style={{ 
                        margin: 'auto',
                        // right: '10%',

          }}>
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword" >
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2" style={{ 
                        margin: 'auto',
                        // right: '10%',

          }}>
                    <Button variant="primary" type="Submit">
                      Log In
                    </Button>
                    <div className="w-100 text-center mt-1">
                      <Link to="/forgotPassword">Forgot password?</Link>
                    </div>
                  </div>
                </Form>
                <hr />
                <div>
                  <GoogleButton
                    className="g-btn"
                    type="dark"
                    onClick={handleGoogleSignIn}
                  />
                </div>
              </div>
              <div className="p-4 mt-3 text-center">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </body>
    </>
  );
};

export default Login;
