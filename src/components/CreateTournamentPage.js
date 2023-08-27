import React, { useState } from 'react';
import '../css/CreateTournamentPage.css'

function CreateTournamentPage() {
  const [tournamentData, setTournamentData] = useState({
    name: '',
    sportType: '',
    startDateTime: '',
    location: '',
    description: '',
    organizer_id: 1, // You might need to adjust this based on your data
    rules: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTournamentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send the tournamentData to your backend for processing
    // You might use an API call or other mechanism to save the data
    // After successful creation, you can redirect the user to the tournament list page
  };

  return (
    <div className="create-tournament-page">
      <h2>Create New Tournament</h2>
      <form onSubmit={handleSubmit} className="tournament-form">
        <label htmlFor="name">Tournament Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={tournamentData.name}
          onChange={handleInputChange}
        />

        <label htmlFor="sportType">Sport Type:</label>
        <input
          type="text"
          id="sportType"
          name="sportType"
          value={tournamentData.sportType}
          onChange={handleInputChange}
        />

        <label htmlFor="startDateTime">Start Date and Time:</label>
        <input
          type="datetime-local"
          id="startDateTime"
          name="startDateTime"
          value={tournamentData.startDateTime}
          onChange={handleInputChange}
        />

        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={tournamentData.location}
          onChange={handleInputChange}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={tournamentData.description}
          onChange={handleInputChange}
        />

        <label htmlFor="rules">Rules:</label>
        <textarea
          id="rules"
          name="rules"
          value={tournamentData.rules}
          onChange={handleInputChange}
        />

        <button type="submit" className="submit-button">Create Tournament</button>
      </form>
    </div>
  );
}

export default CreateTournamentPage;
