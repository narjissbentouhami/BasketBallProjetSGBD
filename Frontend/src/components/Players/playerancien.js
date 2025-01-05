import React, { useState } from "react";
import axios from "axios";
import "./Players.css"; // Add custom styles if needed

const Players = () => {
    // State for each bloc
    const [playerInfo, setPlayerInfo] = useState({ name: "", birth_date: "", height: "", citizenship: "" });
    const [assignPlayer, setAssignPlayer] = useState({ playerId: "", clubId: "" });
    const [transferPlayer, setTransferPlayer] = useState({ playerId: "", fromClubId: "", toClubId: "" });
    const [updateInfo, setUpdateInfo] = useState({ playerId: "", field: "", value: "" });
    const [deletePlayerId, setDeletePlayerId] = useState("");

    // Handlers for each API request
    const handleAddPlayer = async () => {
        try {
            await axios.post("http://localhost:8080/api/players/", playerInfo);
            alert("Player added successfully!");
            setPlayerInfo({ name: "", birth_date: "", height: "", citizenship: "" });
        } catch (error) {
            console.error("Error adding player:", error);
            alert("Failed to add player.");
        }
    };

    const handleAssignToClub = async () => {
        try {
            await axios.post("http://localhost:5001/players/add-to-club", assignPlayer);
            alert("Player assigned to club successfully!");
            setAssignPlayer({ playerId: "", clubId: "" });
        } catch (error) {
            console.error("Error assigning player:", error);
            alert("Failed to assign player to club.");
        }
    };

    const handleTransferPlayer = async () => {
        try {
            await axios.post("http://localhost:5001/players/transfer", transferPlayer);
            alert("Player transferred successfully!");
            setTransferPlayer({ playerId: "", fromClubId: "", toClubId: "" });
        } catch (error) {
            console.error("Error transferring player:", error);
            alert("Failed to transfer player.");
        }
    };

    const handleUpdatePlayer = async () => {
        try {
            await axios.put("http://localhost:5001/players/update", updateInfo);
            alert("Player information updated successfully!");
            setUpdateInfo({ playerId: "", field: "", value: "" });
        } catch (error) {
            console.error("Error updating player:", error);
            alert("Failed to update player information.");
        }
    };

    const handleDeletePlayer = async () => {
        try {
            await axios.delete(`http://localhost:5001/players/delete/${deletePlayerId}`);
            alert("Player deleted successfully!");
            setDeletePlayerId("");
        } catch (error) {
            console.error("Error deleting player:", error);
            alert("Failed to delete player.");
        }
    };

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
                    placeholder="birth_date"
                    value={playerInfo.birth_date}
                    onChange={(e) => setPlayerInfo({ ...playerInfo, birth_date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Height"
                    value={playerInfo.height}
                    onChange={(e) => setPlayerInfo({ ...playerInfo, height: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Citizenship"
                    value={playerInfo.citizenship}
                    onChange={(e) => setPlayerInfo({ ...playerInfo, citizenship: e.target.value })}
                />
                <button onClick={handleAddPlayer}>Add Player</button>
            </div>

            {/* Bloc 2: Add Player to Club */}
            <div className="bloc">
                <h3>Add Player to Club</h3>
                <input
                    type="text"
                    placeholder="Player ID"
                    value={assignPlayer.playerId}
                    onChange={(e) => setAssignPlayer({ ...assignPlayer, playerId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Club ID"
                    value={assignPlayer.clubId}
                    onChange={(e) => setAssignPlayer({ ...assignPlayer, clubId: e.target.value })}
                />
                <button onClick={handleAssignToClub}>Assign to Club</button>
            </div>

            {/* Bloc 3: Transfer Player */}
            <div className="bloc">
                <h3>Transfer Player</h3>
                <input
                    type="text"
                    placeholder="Player ID"
                    value={transferPlayer.playerId}
                    onChange={(e) => setTransferPlayer({ ...transferPlayer, playerId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="From Club ID"
                    value={transferPlayer.fromClubId}
                    onChange={(e) => setTransferPlayer({ ...transferPlayer, fromClubId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="To Club ID"
                    value={transferPlayer.toClubId}
                    onChange={(e) => setTransferPlayer({ ...transferPlayer, toClubId: e.target.value })}
                />
                <button onClick={handleTransferPlayer}>Transfer Player</button>
            </div>

            {/* Bloc 4: Update Player */}
            <div className="bloc">
                <h3>Update Player Information</h3>
                <input
                    type="text"
                    placeholder="Player ID"
                    value={updateInfo.playerId}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, playerId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Field to Update (e.g., name)"
                    value={updateInfo.field}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, field: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="New Value"
                    value={updateInfo.value}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, value: e.target.value })}
                />
                <button onClick={handleUpdatePlayer}>Update Information</button>
            </div>

            {/* Bloc 5: Delete Player */}
            <div className="bloc">
                <h3>Delete Player</h3>
                <input
                    type="text"
                    placeholder="Player ID"
                    value={deletePlayerId}
                    onChange={(e) => setDeletePlayerId(e.target.value)}
                />
                <button onClick={handleDeletePlayer}>Delete Player</button>
            </div>
        </div>
    );
};

export default Players;