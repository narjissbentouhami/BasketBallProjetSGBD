import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Clubs/Clubs.css";

const Championships = () => {
  const [championshipInfo, setChampionshipInfo] = useState({ name: "" });
  const [championships, setChampionships] = useState([]);
  const [selectedChampionship, setSelectedChampionship] = useState(null);
  const [nationalTeams, setNationalTeams] = useState([]);
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const selectedChampionshipRef = useRef(null);

  // Fetch all championships
  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/championships/");
        setChampionships(response.data);
      } catch (error) {
        console.error("Error fetching championships:", error);
      }
    };
    fetchChampionships();
  }, []);

  // Fetch national teams by championship
  const fetchNationalTeamsByChampionship = async (championshipId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/championships/national-teams/${championshipId}`
      );
      setNationalTeams(response.data);
    } catch (error) {
      console.error("Error fetching national teams by championship:", error);
    }
  };

  // Click outside handler to deselect the championship
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedChampionshipRef.current && !selectedChampionshipRef.current.contains(event.target)) {
        setSelectedChampionship(null);
        setNationalTeams([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChampionshipClick = (championship) => {
    setSelectedChampionship(championship);
    fetchNationalTeamsByChampionship(championship.id);
  };

  const handleAddChampionship = async () => {
    try {
      const payload = { name: championshipInfo.name };
      await axios.post("http://localhost:8080/api/championships/", payload);
      alert("Championship added successfully!");
      setChampionshipInfo({ name: "" });

      // Refresh championships
      const response = await axios.get("http://localhost:8080/api/championships/");
      setChampionships(response.data);
    } catch (error) {
      console.error("Error adding championship:", error.response?.data || error.message);
      alert(`Failed to add championship: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateChampionship = async () => {
    if (!updateField || !updateValue) {
      alert("Please select a field and provide a value to update.");
      return;
    }

    try {
      const updatePayload = { [updateField]: updateValue };

      await axios.put(
        `http://localhost:8080/api/championships/${selectedChampionship.id}`,
        updatePayload
      );
      alert("Championship updated successfully!");

      // Update local state
      setSelectedChampionship({ ...selectedChampionship, [updateField]: updateValue });
      setUpdateField("");
      setUpdateValue("");
    } catch (error) {
      console.error("Error updating championship:", error);
      alert("Failed to update championship.");
    }
  };

  const handleDeleteChampionship = async (championshipId) => {
    try {
      await axios.delete(`http://localhost:8080/api/championships/${championshipId}`);
      alert("Championship deleted successfully!");

      // Refresh championships
      const response = await axios.get("http://localhost:8080/api/championships/");
      setChampionships(response.data);

      // Deselect championship if it's the one being deleted
      if (selectedChampionship && selectedChampionship.id === championshipId) {
        setSelectedChampionship(null);
        setNationalTeams([]);
      }
    } catch (error) {
      console.error("Error deleting championship:", error);
      alert("Failed to delete championship.");
    }
  };

  return (
    <div className="clubs-container">
      <h2>Championships Management</h2>

      {/* Add a Championship */}
      <div className="bloc">
        <h3>Add a Championship</h3>
        <input
          type="text"
          placeholder="Championship Name"
          value={championshipInfo.name}
          onChange={(e) => setChampionshipInfo({ ...championshipInfo, name: e.target.value })}
        />
        <button onClick={handleAddChampionship}>Add Championship</button>
      </div>

      {/* Championships Grid */}
      <div className="clubs-grid">
        {championships.map((championship) => (
          <div
            key={championship.id}
            className="club-card"
            onClick={() => handleChampionshipClick(championship)}
          >
            <img
              src={`https://api.dicebear.com/6.x/bottts/svg?seed=${championship.name}`}
              alt={championship.name}
              className="club-image"
            />
            <p className="club-name">{championship.name}</p>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the click on the card
                handleDeleteChampionship(championship.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Selected Championship Details */}
      {selectedChampionship && (
        <div className="selected-club" ref={selectedChampionshipRef}>
          <h3>Selected Championship</h3>
          <img
            src={`https://api.dicebear.com/6.x/bottts/svg?seed=${selectedChampionship.name}`}
            alt={selectedChampionship.name}
            className="selected-club-image"
          />
          <p><strong>Name:</strong> {selectedChampionship.name}</p>

          {/* National Teams in Championship */}
          <h4>National Teams in {selectedChampionship.name}</h4>
          {nationalTeams.length > 0 ? (
            <ul>
              {nationalTeams.map((team) => (
                <li key={team.nationalTeamId}>{team.nationalTeamName}</li>
              ))}
            </ul>
          ) : (
            <p>No national teams found in this championship.</p>
          )}

          {/* Update Championship Fields */}
          <h4>Update Championship</h4>
          <select
            value={updateField}
            onChange={(e) => setUpdateField(e.target.value)}
          >
            <option value="">Select Field to Update</option>
            <option value="name">Name</option>
          </select>
          <input
            type="text"
            placeholder="New Value"
            value={updateValue}
            onChange={(e) => setUpdateValue(e.target.value)}
          />
          <button onClick={handleUpdateChampionship}>Update</button>
        </div>
      )}
    </div>
  );
};

export default Championships;
