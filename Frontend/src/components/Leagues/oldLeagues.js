import React, { useState } from "react";
import axios from "axios";
import "./Leagues.css";

const Leagues = () => {
    const [leagueInfo, setLeagueInfo] = useState({ name: "" });
    const [updateInfo, setUpdateInfo] = useState({ leagueId: "", field: "name", value: "" });
    const [deleteLeagueId, setDeleteLeagueId] = useState("");

    // Handlers for each API request
    const handleAddLeague = async () => {
        try {
            await axios.post("http://localhost:5001/leagues/add", leagueInfo);
            alert("League added successfully!");
            setLeagueInfo({ name: "" });
        } catch (error) {
            console.error("Error adding league:", error);
            alert("Failed to add league.");
        }
    };

    const handleUpdateLeague = async () => {
        try {
            await axios.put("http://localhost:5001/leagues/update", updateInfo);
            alert("League information updated successfully!");
            setUpdateInfo({ leagueId: "", field: "name", value: "" });
        } catch (error) {
            console.error("Error updating league:", error);
            alert("Failed to update league.");
        }
    };

    const handleDeleteLeague = async () => {
        try {
            await axios.delete(`http://localhost:5001/leagues/delete/${deleteLeagueId}`);
            alert("League deleted successfully!");
            setDeleteLeagueId("");
        } catch (error) {
            console.error("Error deleting league:", error);
            alert("Failed to delete league.");
        }
    };

    return (
        <div className="leagues-container">
            <h2>Leagues Management</h2>

            {/* Bloc 1: Add a League */}
            <div className="bloc">
                <h3>Add a League</h3>
                <input
                    type="text"
                    placeholder="League Name"
                    value={leagueInfo.name}
                    onChange={(e) => setLeagueInfo({ name: e.target.value })}
                />
                <button onClick={handleAddLeague}>Add League</button>
            </div>

            {/* Bloc 2: Update League Information */}
            <div className="bloc">
                <h3>Update League Information</h3>
                <input
                    type="text"
                    placeholder="League ID"
                    value={updateInfo.leagueId}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, leagueId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="New Name"
                    value={updateInfo.value}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, value: e.target.value })}
                />
                <button onClick={handleUpdateLeague}>Update League</button>
            </div>

            {/* Bloc 3: Delete League */}
            <div className="bloc">
                <h3>Delete League</h3>
                <input
                    type="text"
                    placeholder="League ID"
                    value={deleteLeagueId}
                    onChange={(e) => setDeleteLeagueId(e.target.value)}
                />
                <button onClick={handleDeleteLeague}>Delete League</button>
            </div>
        </div>
    );
};

export default Leagues;
