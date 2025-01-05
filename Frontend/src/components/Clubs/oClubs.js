import React, { useState} from "react";
import axios from "axios";
import "./Clubs.css"; // Add custom styles for clubs if needed
import { useEffect } from "react";

const Clubs = () => {
    const [clubInfo, setClubInfo] = useState({ name: "", city: "", sponsor_id: "" });
    const [updateInfo, setUpdateInfo] = useState({ clubId: "", field: "", value: "" });
    const [deleteClubId, setDeleteClubId] = useState("");
    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState(null);
    const [updateField, setUpdateField] = useState("");
    const [updateValue, setUpdateValue] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });


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
    // const handleUpdateClub = async () => {
    //     try {
    //         const updatePayload = {
    //             [updateInfo.field]: updateInfo.value,
    //         };
    //         await axios.put(`http://localhost:8080/api/clubs/${updateInfo.clubId}`, updatePayload);
    //         alert("Club information updated successfully!");
    //         setUpdateInfo({ clubId: "", field: "", value: "" });
    //     } catch (error) {
    //         console.error("Error updating club:", error);
    //         alert("Failed to update club information.");
    //     }
    // };

    const handleDeleteClub = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/clubs/${deleteClubId}`);
            alert("Club deleted successfully!");
            setDeleteClubId("");
        } catch (error) {
            console.error("Error deleting club:", error);
            alert("Failed to delete club.");
        }
    };
///////////////
useEffect(() => {
    const fetchClubs = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/clubs/");
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        }
    };
    fetchClubs();
}, []);

const handleClubClick = (club) => {
    setSelectedClub(club);
};
const handleUpdateClub = async () => {
    if (!updateField || !updateValue) {
        alert("Please select a field and provide a value to update.");
        return;
    }

    try {
        const updatePayload = {
            [updateField]: updateValue,
        };

        await axios.put(`http://localhost:8080/api/clubs/${selectedClub.id}`, updatePayload);
        setSnackbar({ open: true, message: "Club updated successfully!", severity: "success" });
        setSelectedClub({ ...selectedClub, [updateField]: updateValue }); // Update the local state
        setUpdateField("");
        setUpdateValue("");
    } catch (error) {
        console.error("Error updating club:", error);
        setSnackbar({ open: true, message: "Failed to update club.", severity: "error" });
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

            {/* Bloc 2: Update Club Information */}
            <div className="bloc">
                <h3>Update Club Information</h3>
                <input
                    type="text"
                    placeholder="Club ID"
                    value={updateInfo.clubId}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, clubId: e.target.value })}
                />
                <select
                    value={updateInfo.field}
                    onChange={(e) => setUpdateInfo({ ...updateInfo, field: e.target.value })}
                >
                    <option value="">Select Field to Update</option>
                    <option value="name">Name</option>
                    <option value="city">City</option>
                </select>
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
            {/* Display all clubs */}
            <div className="clubs-grid">
                {clubs.map((club) => (
                    <div
                        key={club.id}
                        className="club-card"
                        onClick={() => handleClubClick(club)}
                    >
                        <img
                            src={club.icon || "https://via.placeholder.com/150"}
                            alt={club.name}
                            className="club-image"
                        />
                        <p>{club.name}</p>
                    </div>
                ))}
            </div>

            {/* Show selected club details */}
            {selectedClub && (
                <div className="selected-club">
                    <h3>Selected Club</h3>
                    <img
                        src={selectedClub.icon || "https://via.placeholder.com/150"}
                        alt={selectedClub.name}
                        className="selected-club-image"
                    />
                    <p><strong>Name:</strong> {selectedClub.name}</p>
                    <p><strong>City:</strong> {selectedClub.city}</p>
                    <p><strong>Sponsor ID:</strong> {selectedClub.sponsor_id || "None"}</p>

                    {/* Update club fields */}
                    <h4>Update Club</h4>
                    <select
                        value={updateField}
                        onChange={(e) => setUpdateField(e.target.value)}
                    >
                        <option value="">Select Field to Update</option>
                        <option value="name">Name</option>
                        <option value="city">City</option>
                        <option value="sponsor_id">Sponsor ID</option>
                    </select>
                    <input
                        type="text"
                        placeholder="New Value"
                        value={updateValue}
                        onChange={(e) => setUpdateValue(e.target.value)}
                    />
                    <button onClick={handleUpdateClub}>Update</button>
                </div>
            )}
        </div>
    );
       
};

export default Clubs;
