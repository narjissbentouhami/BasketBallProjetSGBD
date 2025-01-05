import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("players");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserService.getAdminBoard();
        setContent(response.data);
      } catch (error) {
        setContent(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        );

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardAdmin;
