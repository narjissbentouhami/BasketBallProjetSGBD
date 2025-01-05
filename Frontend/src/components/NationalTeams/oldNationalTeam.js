import React, { useState } from "react";
import axios from "axios";
import "./NationalTeams.css"; // Add custom styles for national teams if needed

const NationalTeams = () => {
    const [teamInfo, setTeamInfo] = useState({ name: "", country: "" });
    const [updateInfo, setUpdateInfo] = useState({ teamId: "", field: "", value: "" });
    const [deleteTeamId, setDeleteTeamId] = useState("");

    // Handlers for each API request
    const handleAddTeam = async () => {
        try {
            await axios.post("http://localhost:5001/national-teams/add", teamInfo);
            alert("National Team added successfully!");
            setTeamInfo({ name: "", country: "" });
        } catch (error) {
            console.error("Error adding team:", error);
            alert("Failed to add team.");
        }
    };

    const handleUpdateTeam = async () => {
        try {
            await axios.put("http://localhost:5001/national-teams/update", updateInfo);
            alert("National Team information updated successfully!");
            setUpdateInfo({ teamId: "", field: "", value: "" });
        } catch (error) {
            console.error("Error updating team:", error);
            alert("Failed to update team information.");
        }
    };

    const handleDeleteTeam = async () => {
        try {
            await axios.delete(`http://localhost:5001/national-teams/delete/${deleteTeamId}`);
            alert("National Team deleted successfully!");
            setDeleteTeamId("");
        } catch (error) {
            console.error("Error deleting team:", error);
            alert("Failed to delete team.");
        }
    };

    return (
        <div className="national-teams-container">
            <h2>National Teams Management</h2>

            {/* Bloc 1: Add a National Team */}
            <div className="bloc">
                <h3>Add a National Team</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={teamInfo.name}
                    onChange={(e) => setTeamInfo({ ...teamInfo, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={teamInfo.country}
                    onChange={(e) => setTeamInfo({ ...teamInfo, country: e.target.value })}
                />
                <button onClick={handleAddTeam}>Add Team</button>
            </div>

            {/* Bloc 2: Update National Team Information */}
            <div className="bloc">
                <h3>Update National Team Information</h3>
                <input
                    type="text"
                    placeholder="Team ID"
                    value={updateInfo.teamId}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, teamId: e.target.value })}
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
                <button onClick={handleUpdateTeam}>Update Team</button>
            </div>

            {/* Bloc 3: Delete National Team */}
            <div className="bloc">
                <h3>Delete National Team</h3>
                <input
                    type="text"
                    placeholder="Team ID"
                    value={deleteTeamId}
                    onChange={(e) => setDeleteTeamId(e.target.value)}
                />
                <button onClick={handleDeleteTeam}>Delete Team</button>
            </div>
        </div>
    );
};

export default NationalTeams;
