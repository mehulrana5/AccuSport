import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../Context';
import '../css/PlayerDetail.css';

const PlayerDetail = () => {
  const { playerId } = useParams();
  const { dummyData } = useContext(AppContext);

  const player = dummyData.playerDetails.find(player => player.id === parseInt(playerId));
  
  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  }
  
  if (!player) {
    return <p>Player not found.</p>;
  }

  return (
    <div className="player-detail">
      <h2>Player Details - ID: {player.id}</h2>
      <p>Name: {player.name}</p>
      <p>Age: {calculateAge(player.DOB)}</p>
      <p>Email: {player.email}</p>
      <p>Phone: {player.phoneNumber}</p>
      <h3>Team(s):</h3>
      <ul>
        {player.team_ids.map((teamId) => (
          <li key={teamId}>Team id:{teamId}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerDetail;
