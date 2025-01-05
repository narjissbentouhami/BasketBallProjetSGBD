import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Players from "../components/Players/Players";
import Clubs from "../components/Clubs/Clubs";
import NationalTeams from "../components/NationalTeams/NationalTeams";
import Leagues from "../components/Leagues/Leagues";
import Championships from "../components/Championships/Championships";
import Sponsors from "../components/Sponsors/Sponsors";
import "./app.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("players");
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: "", roles: [] });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      setRedirect("/home");
    } else {
      setCurrentUser(currentUser);
      setUserReady(true);
    }
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  const renderContent = () => {
    switch (activeTab) {
        case "players":
            return <Players />;
        case "clubs":
            return <Clubs />;
        case "national-teams":
            return <NationalTeams />;
        case "leagues":
            return <Leagues />;
        case "championships":
            return <Championships />;
        case "sponsors":
            return <Sponsors />;
        default:
            return <div className="content">Select a Tab</div>;
    }
};

  return (
    <div className="container">
      {userReady ? (
        <div>
          {/* <header className="jumbotron">
            <h3>
              <strong>{currentUser.username}</strong> Profile
            </h3>
          </header> */}
          <ul>
            {currentUser.roles &&
              currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
          </ul>
          <div className="tabs">
                <button
                    className={`tab ${activeTab === "players" ? "active" : ""}`}
                    onClick={() => setActiveTab("players")}
                >
                    Players
                </button>
                <button
                    className={`tab ${activeTab === "clubs" ? "active" : ""}`}
                    onClick={() => setActiveTab("clubs")}
                >
                    Clubs
                </button>
                <button
                    className={`tab ${activeTab === "national-teams" ? "active" : ""}`}
                    onClick={() => setActiveTab("national-teams")}
                >
                    National Teams
                </button>
                <button
                    className={`tab ${activeTab === "leagues" ? "active" : ""}`}
                    onClick={() => setActiveTab("leagues")}
                >
                    Leagues
                </button>
                <button
                    className={`tab ${activeTab === "championships" ? "active" : ""}`}
                    onClick={() => setActiveTab("championships")}
                >
                    Championships
                </button>
                <button
                    className={`tab ${activeTab === "sponsors" ? "active" : ""}`}
                    onClick={() => setActiveTab("sponsors")}
                >
                    Sponsors
                </button>
            </div>
            <main>{renderContent()}</main>
        </div>
        
      ) : null}
    </div>
  );
};

export default Profile;

