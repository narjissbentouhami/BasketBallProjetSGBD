import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Select from "react-select";
import { countries } from "countries-list";
import Modal from "@mui/material/Modal";
import "./Players.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Players = () => {
  // State for each bloc
  const [playerInfo, setPlayerInfo] = useState({ name: "", birth_date: "", height: "", citizenship: "" });
  const [assignPlayer, setAssignPlayer] = useState({ playerId: "", clubId: "" });
  const [transferPlayer, setTransferPlayer] = useState({ playerId: "", fromClubId: "", toClubId: "" });
  const [updateInfo, setUpdateInfo] = useState({ playerId: "", field: "", value: "" });
  const [deletePlayerId, setDeletePlayerId] = useState("");
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [players1, setPlayers1] = useState([]);
  const [clubs1, setClubs1] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedClub1, setSelectedClub1] = useState(null);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [playersget, setPlayersget] = useState([]);
  const [selectedPlayerget, setSelectedPlayerget] = useState(null);

  const countryOptions = Object.entries(countries).map(([code, country]) => ({
    value: country.name,
    label: country.name,
  }));
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Handlers for Snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handlers for each API request
  const handleAddPlayer = async () => {
    try {
      await axios.post("http://localhost:8080/api/players/", playerInfo);
      setSnackbar({ open: true, message: "Player added successfully!", severity: "success" });
      setPlayerInfo({ name: "", birth_date: "", height: "", citizenship: "" });
    } catch (error) {
      console.error("Error adding player:", error);
      setSnackbar({ open: true, message: "Failed to add player.", severity: "error" });
    }
  };

  const handleUpdatePlayer = async () => {
    try {
      await axios.put("http://localhost:5001/players/update", updateInfo);
      setSnackbar({ open: true, message: "Player information updated successfully!", severity: "success" });
      setUpdateInfo({ playerId: "", field: "", value: "" });
    } catch (error) {
      console.error("Error updating player:", error);
      setSnackbar({ open: true, message: "Failed to update player information.", severity: "error" });
    }
  };

  const handleDeletePlayer = async () => {
    try {
      await axios.delete(`http://localhost:5001/players/delete/${deletePlayerId}`);
      setSnackbar({ open: true, message: "Player deleted successfully!", severity: "success" });
      setDeletePlayerId("");
    } catch (error) {
      console.error("Error deleting player:", error);
      setSnackbar({ open: true, message: "Failed to delete player.", severity: "error" });
    }
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/players");
        setPlayers(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    const fetchClubs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/clubs");
        setClubs(response.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchPlayers();
    fetchClubs();
  }, []);
  useEffect(() => {
    const fetchPlayers1 = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/players");
        setPlayers1(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    const fetchClubs1 = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/nationalTeams");
        setClubs1(response.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchPlayers1();
    fetchClubs1();
  }, []);
  useEffect(() => {
    const fetchPlayersget = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/players");
        setPlayersget(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayersget();
    }, []);

  const handleAssignToClub2 = async () => {
    if (selectedPlayer && selectedClub) {
      try {
        await axios.put(`http://localhost:8080/api/players/updateClub/${selectedPlayer.id}`, {
          club_id: selectedClub.value, // Send only club_id
        });
        setSnackbar({ open: true, message: "Player assigned to club successfully!", severity: "success" });
        setModalOpen(false); // Close the modal
        setSelectedPlayer(null); // Reset the selection
        setSelectedClub(null);
      } catch (error) {
        console.error("Error assigning player to club:", error);
        setSnackbar({ open: true, message: "Failed to assign player to club.", severity: "error" });
      }
    } else {
      setSnackbar({ open: true, message: "Please select a player and a club.", severity: "warning" });
    }
  };

  const handleAssignToNationalTeam = async () => {
    if (selectedPlayer1 && selectedClub1) {
      try {
        await axios.put(`http://localhost:8080/api/players/updateNationalTeam/${selectedPlayer1.id}`, {
          nationalTeam_id: selectedClub1.value, 
        });
        setSnackbar({ open: true, message: "Player assigned to National Team successfully!", severity: "success" });
        setModalOpen1(false); // Close the modal
        setSelectedPlayer1(null); // Reset the selection
        setSelectedClub1(null);
      } catch (error) {
        console.error("Error assigning player to club:", error);
        setSnackbar({ open: true, message: "Failed to assign player to National Team.", severity: "error" });
      }
    } else {
      setSnackbar({ open: true, message: "Please select a player and a National Team.", severity: "warning" });
    }
  };
  

  const clubOptions = clubs.map((club) => ({
    value: club.id,
    label: club.name,
  }));
  const clubOptions1 = clubs1.map((club) => ({
    value: club.id,
    label: club.name,
  }));

  return (
    <div className="players-container">
      <h2>Players Management</h2>

      {/* Bloc 1: Add a Player */}
      <div className="bloc">
        <h3>Add a Player</h3>
        <input
          type="text"
          placeholder="Name"
          value={playerInfo.name}
          onChange={(e) => setPlayerInfo({ ...playerInfo, name: e.target.value })}
        />
        <input
          type="date"
          placeholder="Birth Date"
          value={playerInfo.birth_date}
          onChange={(e) => setPlayerInfo({ ...playerInfo, birth_date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Height"
          value={playerInfo.height}
          onChange={(e) => setPlayerInfo({ ...playerInfo, height: e.target.value })}
        />
        <Select
          options={countryOptions}
          placeholder="Select Citizenship"
          onChange={(selectedOption) =>
            setPlayerInfo({ ...playerInfo, citizenship: selectedOption.value })
          }
          value={countryOptions.find((option) => option.value === playerInfo.citizenship) || null}
          styles={{
            control: (provided) => ({
              ...provided,
              width: "97.2%", // Set the width to match your input
              height: "42px", // Match the height of your input (optional)
              borderRadius: "5px", // Same border-radius as your input
              border: "1px solid #ddd", // Match border style
              boxShadow: "none", // Remove default shadow
            }),
            menu: (provided) => ({
              ...provided,
              width: "97.1%", // Ensure dropdown width matches input width
            }),
          }}
        />
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>

      {/* Bloc 2: Add Player to Club */}
      <div className="bloc">
        <h3>Assign or Transfer a Player to a Club</h3>
        <button onClick={() => setModalOpen(true)}>Open Player List</button>
        <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="assign-player-modal"
        aria-describedby="assign-player-to-club"
      >
        <div style={{ backgroundColor: "#fff", padding: "20px", margin: "50px auto", maxWidth: "600px" }}>
          <h3>Select a Player</h3>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {players.map((player) => (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={player.icon || "https://via.placeholder.com/50"}
                    alt={player.name}
                    style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
                  />
                  <span>{player.name}</span>
                </div>
                <button
                  onClick={() => setSelectedPlayer(player)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: selectedPlayer?.id === player.id ? "#4caf50" : "#ddd",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {selectedPlayer?.id === player.id ? "Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>
          <h3>Select a Club</h3>
          <Select
            options={clubOptions}
            placeholder="Select Club"
            onChange={(selectedOption) => setSelectedClub(selectedOption)}
            value={selectedClub}
          />
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handleAssignToClub2}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Assign
            </button>
          </div>
        </div>
      </Modal>
      </div>
 {/* Bloc 3: Add Player to NationalTeam */}
 <div className="bloc">
        <h3>Assign or Transfer a Player to a National Team</h3>
        <button onClick={() => setModalOpen1(true)}>Open Player List</button>
        <Modal
        open={modalOpen1}
        onClose={() => setModalOpen1(false)}
        aria-labelledby="assign-player-modal"
        aria-describedby="assign-player-to-club"
      >
        <div style={{ backgroundColor: "#fff", padding: "20px", margin: "50px auto", maxWidth: "600px" }}>
          <h3>Select a Player</h3>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {players1.map((player) => (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={player.icon || "https://via.placeholder.com/50"}
                    alt={player.name}
                    style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
                  />
                  <span>{player.name}</span>
                </div>
                <button
                  onClick={() => setSelectedPlayer1(player)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: selectedPlayer1?.id === player.id ? "#4caf50" : "#ddd",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {selectedPlayer1?.id === player.id ? "Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>
          <h3>Select a National Team</h3>
          <Select
            options={clubOptions1}
            placeholder="Select Club"
            onChange={(selectedOption) => setSelectedClub1(selectedOption)}
            value={selectedClub1}
          />
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handleAssignToNationalTeam}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Assign
            </button>
          </div>
        </div>
      </Modal>
      </div>
      <div className="bloc">
{/* Bloc 4: get All Players */}
 {/* Bloc 4: Get All Players */}
<div className="bloc">
  <h3>All Players</h3>
  <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
    {playersget.map((player) => (
      <div
        key={player.id}
        style={{
          width: "150px",
          textAlign: "center",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
          cursor: "pointer",
          position: "relative",
          transition: "transform 0.2s",
        }}
        onClick={() => setSelectedPlayerget(player)} // Open modal on click
      >
        <img
          src={`https://api.dicebear.com/6.x/bottts/svg?seed=${player.name}`}
        //   src={`https://source.unsplash.com/100x100/?face,portrait&sig=${player.id}`}
          alt={player.name}
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <p style={{ fontWeight: "bold", margin: "10px 0 0" }}>{player.name}</p>
      </div>
    ))}
  </div>

  {/* Modal for Player Details */}
  {selectedPlayerget && (
    <Modal
      open={!!selectedPlayerget}
      onClose={() => setSelectedPlayerget(null)}
      aria-labelledby="player-info-modal"
      aria-describedby="player-info-details"
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          margin: "50px auto",
          maxWidth: "400px",
          textAlign: "center",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>{selectedPlayerget.name}</h3>
        <img
          src={selectedPlayerget.icon || `https://api.dicebear.com/6.x/bottts/svg?seed=${selectedPlayerget.name}`}
          alt={selectedPlayerget.name}
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />
        <p><strong>Birth Date:</strong> {new Date(selectedPlayerget.birth_date).toLocaleDateString()}</p>
        <p><strong>Height:</strong> {selectedPlayerget.height || "N/A"}</p>
        <p><strong>Citizenship:</strong> {selectedPlayerget.citizenship || "N/A"}</p>
        <p><strong>Club ID:</strong> {selectedPlayerget.club_id || "None"}</p>
        <p><strong>National Team ID:</strong> {selectedPlayerget.nationalTeam_id || "None"}</p>
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#ff4444",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onClick={async () => {
            try {
              await axios.delete(`http://localhost:8080/api/players/${selectedPlayerget.id}`);
              setSnackbar({ open: true, message: "Player deleted successfully!", severity: "success" });
              setSelectedPlayerget(null); // Close modal
              setPlayersget((prev) => prev.filter((p) => p.id !== selectedPlayerget.id)); // Update players list
            } catch (error) {
              console.error("Error deleting player:", error);
              setSnackbar({ open: true, message: "Failed to delete player.", severity: "error" });
            }
          }}
        >
          Delete Player
        </button>
      </div>
    </Modal>
  )}
</div>

</div>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Players;
