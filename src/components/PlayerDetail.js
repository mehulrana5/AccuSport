import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../Context';
import '../css/PlayerDetail.css';

const PlayerDetail = () => {
  const { playerId } = useParams();
  const { dummyData } = useContext(AppContext);

  const player = dummyData.playerDetails.find(player => player.id === parseInt(playerId));

  if (!player) {
    return <p>Player not found.</p>;
  }

  return (
    <div className="player-detail">
      <h2>Player Details - ID: {player.id}</h2>
      <p>Name: {player.name}</p>
      <p>Age: {player.age}</p>
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
