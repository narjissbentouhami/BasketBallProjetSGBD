import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Clubs/Clubs.css";

const Leagues = () => {
  const [clubInfo, setClubInfo] = useState({ name: "", country: ""});
  const [clubs, setClubs] = useState([]);
  const [sponsors, setSponsors] = useState([]); // Sponsors list
  const [selectedClub, setSelectedClub] = useState(null);
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState(""); // Selected sponsor for update
  const selectedClubRef = useRef(null);
  const [clubsInLeague, setClubsInLeague] = useState([]);

  const fetchClubsByLeague = async (leagueId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/clubs/by-league/${leagueId}`);
      setClubsInLeague(response.data);
    } catch (error) {
      console.error("Error fetching clubs by league:", error);
    }
  };

  // Fetch all clubs and sponsors on mount
  useEffect(() => {
    const fetchClubsAndSponsors = async () => {
      try {
        const clubsResponse = await axios.get("http://localhost:8080/api/leagues/");
        setClubs(clubsResponse.data);

        const sponsorsResponse = await axios.get("http://localhost:8080/api/sponsors/");
        setSponsors(sponsorsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchClubsAndSponsors();
  }, []);

  // Handle click outside of the selected club details
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedClubRef.current && !selectedClubRef.current.contains(event.target)) {
        setSelectedClub(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const handleAddClub = async () => {
    try {
        const payload = {
            name: clubInfo.name,
            country: clubInfo.country,
            ...(clubInfo.sponsor_id && { sponsor_id: clubInfo.sponsor_id }), // Include sponsor_id only if it's set
        };

        console.log("Payload being sent:", payload); // Debugging log

        await axios.post("http://localhost:8080/api/leagues/", payload);
        alert("Club added successfully!");
        setClubInfo({ name: "", country: "", sponsor_id: "" });
    } catch (error) {
        console.error("Error adding club:", error.response?.data || error.message);
        alert(`Failed to add club: ${error.response?.data?.message || error.message}`);
    }
};

  const handleUpdateClub = async () => {
    if (!updateField || (!updateValue && updateField !== "sponsor_id")) {
      alert("Please select a field and provide a value to update.");
      return;
    }

    try {
      const updatePayload =
        updateField === "sponsor_id"
          ? { sponsor_id: selectedSponsor }
          : { [updateField]: updateValue };

      await axios.put(`http://localhost:8080/api/leagues/${selectedClub.id}`, updatePayload);
      alert("Club updated successfully!");

      // Update local club state
      setSelectedClub({
        ...selectedClub,
        [updateField]: updateField === "sponsor_id" ? selectedSponsor : updateValue,
      });

      setUpdateField("");
      setUpdateValue("");
      setSelectedSponsor("");
    } catch (error) {
      console.error("Error updating club:", error);
      alert("Failed to update club.");
    }
  };

  const handleClubClick = (club) => {
    setSelectedClub(club);
    fetchClubsByLeague(club.id);
  };

  const handleDeleteClub = async (clubId) => {
    try {
      await axios.delete(`http://localhost:8080/api/leagues/${clubId}`);
      alert("Club deleted successfully!");

      // Refresh clubs
      const clubsResponse = await axios.get("http://localhost:8080/api/leagues/");
      setClubs(clubsResponse.data);

      // Deselect club if it's the one being deleted
      if (selectedClub && selectedClub.id === clubId) {
        setSelectedClub(null);
      }
    } catch (error) {
      console.error("Error deleting club:", error);
      alert("Failed to delete club.");
    }
  };

  return (
    <div className="clubs-container">
      <h2>Leaguess Management</h2>

      {/* Add a Club */}
      <div className="bloc">
        <h3>Add a League</h3>
        <input
          type="text"
          placeholder="Club Name"
          value={clubInfo.name}
          onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          value={clubInfo.country}
          onChange={(e) => setClubInfo({ ...clubInfo, country: e.target.value })}
        />
        <button onClick={handleAddClub}>Add League</button>
      </div>

      {/* Clubs Grid */}
      <div className="clubs-grid">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="club-card"
            onClick={() => handleClubClick(club)}
          >
            <img
              src={club.icon || `https://api.dicebear.com/6.x/bottts/svg?seed=${club.name}`}
              alt={club.name}
              className="club-image"
            />
            <p className="club-name">{club.name}</p>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the click on the card
                handleDeleteClub(club.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Selected Club Details */}
      {selectedClub && (
        <div className="selected-club" ref={selectedClubRef}>
          <h3>Selected League</h3>
          <img
            src={selectedClub.icon || `https://api.dicebear.com/6.x/bottts/svg?seed=${selectedClub.name}`}
            alt={selectedClub.name}
            className="selected-club-image"
          />
          <p><strong>Name :</strong> {selectedClub.name}</p>
          <p><strong>Country :</strong> {selectedClub.country}</p>
          {/* Clubs in League */}
          <h4>Clubs in {selectedClub.name}</h4>
          {clubsInLeague.length > 0 ? (
            <ul>
              {clubsInLeague.map((club) => (
                <li key={club.clubId}>{club.clubName}</li>
              ))}
            </ul>
          ) : (
            <p>No clubs found in this league.</p>
          )}

          {/* Update Club Fields */}
          <h4>Update League</h4>
          <select
            value={updateField}
            onChange={(e) => setUpdateField(e.target.value)}
          >
            <option value="">Select Field to Update</option>
            <option value="name">Name</option>
            <option value="country">Country</option>
          </select>

          <button onClick={handleUpdateClub}>Update</button>
        </div>
      )}
    </div>
  );
};

export default Leagues;