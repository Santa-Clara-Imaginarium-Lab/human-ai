import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  // const test = async () => {
  //   await fetch("http://localhost:3000/api/test",{
  //     credentials:"include",
  //   });
  // };

  return (
    <div className="homepage">
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <Link to="/dashboard">Chat with AI</Link>
      </div>
    </div>
  );
};

export default Homepage;