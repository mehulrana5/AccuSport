import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../Context';

const PlayerDetail = () => {
  const { playerId } = useParams();
  const context = useContext(AppContext);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    async function loadDetails(pid) {
      try {
        const data = await context.fetchPlayerData(pid);
        setPlayer(data);
      } catch (error) {
        console.error('Error loading player details:', error);
      }
    }
    loadDetails(playerId);
    // eslint-disable-next-line
  }, [playerId]);
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
    <div className="container-2">
      <table className="details-table" style={{ width: '30%', minWidth: '200px' }}>
        <tbody>
          <tr>
            <td className="details-label">ID</td>
            <td className="details-value">{player._id}</td>
          </tr>
          <tr>
            <td className="details-label">Name</td>
            <td className="details-value">{player.player_name}</td>
          </tr>
          <tr>
            <td className="details-label">Age</td>
            <td className="details-value">{calculateAge(player.player_dob)}</td>
          </tr>
          <tr>
            <td className="details-label">Teams</td>
            <td className="details-value">{player.team_ids.join(" ")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PlayerDetail;
