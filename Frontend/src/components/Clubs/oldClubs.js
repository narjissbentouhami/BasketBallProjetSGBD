import React, { useState } from "react";
import axios from "axios";
import "./Clubs.css"; // Add custom styles for clubs if needed

const Clubs = () => {
    const [clubInfo, setClubInfo] = useState({ name: "", city: "", league: "" });
    const [updateInfo, setUpdateInfo] = useState({ clubId: "", field: "", value: "" });
    const [deleteClubId, setDeleteClubId] = useState("");

    // Handlers for each API request
    const handleAddClub = async () => {
        try {
            await axios.post("http://localhost:5001/clubs/add", clubInfo);
            alert("Club added successfully!");
            setClubInfo({ name: "", city: "", league: "" });
        } catch (error) {
            console.error("Error adding club:", error);
            alert("Failed to add club.");
        }
    };

    const handleUpdateClub = async () => {
        try {
            await axios.put("http://localhost:5001/clubs/update", updateInfo);
            alert("Club information updated successfully!");
            setUpdateInfo({ clubId: "", field: "", value: "" });
        } catch (error) {
            console.error("Error updating club:", error);
            alert("Failed to update club information.");
        }
    };

    const handleDeleteClub = async () => {
        try {
            await axios.delete(`http://localhost:5001/clubs/delete/${deleteClubId}`);
            alert("Club deleted successfully!");
            setDeleteClubId("");
        } catch (error) {
            console.error("Error deleting club:", error);
            alert("Failed to delete club.");
        }
    };

    return (
        <div className="clubs-container">
            <h2>Clubs Management</h2>

            {/* Bloc 1: Add a Club */}
            <div className="bloc">
                <h3>Add a Club</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={clubInfo.name}
                    onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={clubInfo.city}
                    onChange={(e) => setClubInfo({ ...clubInfo, city: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="League"
                    value={clubInfo.league}
                    onChange={(e) => setClubInfo({ ...clubInfo, league: e.target.value })}
                />
                <button onClick={handleAddClub}>Add Club</button>
            </div>

            {/* Bloc 2: Update Club Information */}
            <div className="bloc">
                <h3>Update Club Information</h3>
                <input
                    type="text"
                    placeholder="Club ID"
                    value={updateInfo.clubId}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, clubId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Field to Update (e.g., name, city)"
                    value={updateInfo.field}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, field: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="New Value"
                    value={updateInfo.value}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, value: e.target.value })}
                />
                <button onClick={handleUpdateClub}>Update Club</button>
            </div>

            {/* Bloc 3: Delete Club */}
            <div className="bloc">
                <h3>Delete Club</h3>
                <input
                    type="text"
                    placeholder="Club ID"
                    value={deleteClubId}
                    onChange={(e) => setDeleteClubId(e.target.value)}
                />
                <button onClick={handleDeleteClub}>Delete Club</button>
            </div>
        </div>
    );
};

export default Clubs;
