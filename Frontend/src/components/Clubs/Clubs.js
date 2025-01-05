import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Clubs.css";

const Clubs = () => {
  const [clubInfo, setClubInfo] = useState({ name: "", city: "", sponsor_id: "" });
  const [clubs, setClubs] = useState([]);
  const [sponsors, setSponsors] = useState([]); // Sponsors list
  const [selectedClub, setSelectedClub] = useState(null);
  const [updateField, setUpdateField] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState(""); // Selected sponsor for update
  const selectedClubRef = useRef(null);

  // Fetch all clubs and sponsors on mount
  useEffect(() => {
    const fetchClubsAndSponsors = async () => {
      try {
        const clubsResponse = await axios.get("http://localhost:8080/api/clubs/");
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

//   const handleAddClub = async () => {
//     try {
//       await axios.post("http://localhost:8080/api/clubs/", clubInfo);
//       alert("Club added successfully!");
//       setClubInfo({ name: "", city: "", sponsor_id: "" });
//       setClubs((prev) => [...prev, clubInfo]);
//     } catch (error) {
//       console.error("Error adding club:", error.response?.data || error.message);
//       alert("Failed to add club.");
//     }
//   };
const handleAddClub = async () => {
    try {
        const payload = {
            name: clubInfo.name,
            city: clubInfo.city,
            ...(clubInfo.sponsor_id && { sponsor_id: clubInfo.sponsor_id }), // Include sponsor_id only if it's set
        };

        console.log("Payload being sent:", payload); // Debugging log

        await axios.post("http://localhost:8080/api/clubs/", payload);
        alert("Club added successfully!");
        setClubInfo({ name: "", city: "", sponsor_id: "" });
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

      await axios.put(`http://localhost:8080/api/clubs/${selectedClub.id}`, updatePayload);
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
  };

  const handleDeleteClub = async (clubId) => {
    try {
      await axios.delete(`http://localhost:8080/api/clubs/${clubId}`);
      alert("Club deleted successfully!");

      // Refresh clubs
      const clubsResponse = await axios.get("http://localhost:8080/api/clubs/");
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
      <h2>Clubs Management</h2>

      {/* Add a Club */}
      <div className="bloc">
        <h3>Add a Club</h3>
        <input
          type="text"
          placeholder="Club Name"
          value={clubInfo.name}
          onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          value={clubInfo.city}
          onChange={(e) => setClubInfo({ ...clubInfo, city: e.target.value })}
        />
        <button onClick={handleAddClub}>Add Club</button>
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
          <h3>Selected Club</h3>
          <img
            src={selectedClub.icon || `https://api.dicebear.com/6.x/bottts/svg?seed=${selectedClub.name}`}
            alt={selectedClub.name}
            className="selected-club-image"
          />
          <p><strong>Name :</strong> {selectedClub.name}</p>
          <p><strong>City :</strong> {selectedClub.city}</p>
          <p><strong>Sponsor ID:</strong> {selectedClub.sponsor_id || "None"}</p>

          {/* Update Club Fields */}
          <h4>Update Club</h4>
          <select
            value={updateField}
            onChange={(e) => setUpdateField(e.target.value)}
          >
            <option value="">Select Field to Update</option>
            <option value="name">Name</option>
            <option value="city">City</option>
            <option value="sponsor_id">Sponsor</option>
          </select>

          {updateField === "sponsor_id" ? (
            <select
              value={selectedSponsor}
              onChange={(e) => setSelectedSponsor(e.target.value)}
            >
              <option value="">Select Sponsor</option>
              {sponsors.map((sponsor) => (
                <option key={sponsor.id} value={sponsor.id}>
                  {sponsor.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="New Value"
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
            />
          )}

          <button onClick={handleUpdateClub}>Update</button>
        </div>
      )}
    </div>
  );
};

export default Clubs;