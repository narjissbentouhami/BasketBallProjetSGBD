import React, { useState } from "react";
import axios from "axios";
import "./Sponsors.css";

const Sponsors = () => {
    const [sponsorInfo, setSponsorInfo] = useState({ name: "" });
    const [updateInfo, setUpdateInfo] = useState({ sponsorId: "", field: "name", value: "" });
    const [deleteSponsorId, setDeleteSponsorId] = useState("");

    // Handlers for each API request
    // const handleAddSponsor = async () => {
    //     try {
    //         await axios.post("http://localhost:5001/sponsors/add", sponsorInfo);
    //         alert("Sponsor added successfully!");
    //         setSponsorInfo({ name: "" });
    //     } catch (error) {
    //         console.error("Error adding sponsor:", error);
    //         alert("Failed to add sponsor.");
    //     }
    // };

    // const handleUpdateSponsor = async () => {
    //     try {
    //         await axios.put("http://localhost:5001/sponsors/update", updateInfo);
    //         alert("Sponsor information updated successfully!");
    //         setUpdateInfo({ sponsorId: "", field: "name", value: "" });
    //     } catch (error) {
    //         console.error("Error updating sponsor:", error);
    //         alert("Failed to update sponsor.");
    //     }
    // };

    // const handleDeleteSponsor = async () => {
    //     try {
    //         await axios.delete(`http://localhost:5001/sponsors/delete/${deleteSponsorId}`);
    //         alert("Sponsor deleted successfully!");
    //         setDeleteSponsorId("");
    //     } catch (error) {
    //         console.error("Error deleting sponsor:", error);
    //         alert("Failed to delete sponsor.");
    //     }
    // };
        // Handler to add a sponsor
    const handleAddSponsor = async () => {
        if (!sponsorInfo.name.trim()) {
            alert("Sponsor name is required.");
            return;
        }
        try {
            const response = await axios.post("http://localhost:5001/sponsors/add", sponsorInfo);
            alert(`Sponsor "${response.data.sponsor.name}" added successfully!`);
            setSponsorInfo({ name: "" }); // Reset input field
        } catch (error) {
            console.error("Error adding sponsor:", error);
            alert("Failed to add sponsor.");
        }
    };

    // Handler to update a sponsor
    const handleUpdateSponsor = async () => {
        if (!updateInfo.sponsorId || !updateInfo.value.trim()) {
            alert("Sponsor ID and new value are required.");
            return;
        }
        try {
            const response = await axios.put("http://localhost:5001/sponsors/update", updateInfo);
            alert(`Sponsor updated to "${response.data.sponsor.name}" successfully!`);
            setUpdateInfo({ sponsorId: "", field: "name", value: "" });
        } catch (error) {
            console.error("Error updating sponsor:", error);
            alert("Failed to update sponsor.");
        }
    };

    // Handler to delete a sponsor
    const handleDeleteSponsor = async () => {
        if (!deleteSponsorId) {
            alert("Sponsor ID is required.");
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:5001/sponsors/delete/${deleteSponsorId}`);
            alert(`Sponsor "${response.data.sponsor.name}" deleted successfully!`);
            setDeleteSponsorId(""); // Reset input field
        } catch (error) {
            console.error("Error deleting sponsor:", error);
            alert("Failed to delete sponsor.");
        }
    };

    return (
        <div className="sponsors-container">
            <h2>Sponsors Management</h2>

            {/* Bloc 1: Add a Sponsor */}
            <div className="bloc">
                <h3>Add a Sponsor</h3>
                <input
                    type="text"
                    placeholder="Sponsor Name"
                    value={sponsorInfo.name}
                    onChange={(e) => setSponsorInfo({ name: e.target.value })}
                />
                <button onClick={handleAddSponsor}>Add Sponsor</button>
            </div>

            {/* Bloc 2: Update Sponsor Information */}
            <div className="bloc">
                <h3>Update Sponsor Information</h3>
                <input
                    type="text"
                    placeholder="Sponsor ID"
                    value={updateInfo.sponsorId}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, sponsorId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="New Name"
                    value={updateInfo.value}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, value: e.target.value })}
                />
                <button onClick={handleUpdateSponsor}>Update Sponsor</button>
            </div>

            {/* Bloc 3: Delete Sponsor */}
            <div className="bloc">
                <h3>Delete Sponsor</h3>
                <input
                    type="text"
                    placeholder="Sponsor ID"
                    value={deleteSponsorId}
                    onChange={(e) => setDeleteSponsorId(e.target.value)}
                />
                <button onClick={handleDeleteSponsor}>Delete Sponsor</button>
            </div>
        </div>
    );
};

export default Sponsors;
