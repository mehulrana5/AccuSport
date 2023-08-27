import React, { useState } from 'react';
import '../css/TeamCreateForm.css'; // Import your CSS file

function TeamCreateForm() {
  const [teamData, setTeamData] = useState({
    name: '',
    sportType: '',
    players: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTeamData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send the teamData to your backend for processing
    // You might use an API call or other mechanism to save the data
    // After successful creation, you can redirect the user to a relevant page
  };

  return (
    <div className="team-create-container">
      <h2>Create New Team</h2>
      <form onSubmit={handleSubmit} className="team-form">
        <label htmlFor="name">Team Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={teamData.name}
          onChange={handleInputChange}
          className="input-field"
        />

        <label htmlFor="sportType">Sport Type:</label>
        <input
          type="text"
          id="sportType"
          name="sportType"
          value={teamData.sportType}
          onChange={handleInputChange}
          className="input-field"
        />

        {/* Add players input fields */}
        
        <button type="submit" className="submit-button">Create Team</button>
      </form>
    </div>
  );
}

export default TeamCreateForm;
