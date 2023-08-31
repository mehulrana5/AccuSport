import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../Context';

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
    <div className="container-2">
      <h2>Player Details - ID: {player.id}</h2>
      <table className="details-table" style={{width:'30%',minWidth:"200px"}}>
        <tbody>
          <tr>
            <td className="details-label">Name</td>
            <td className="details-value">{player.name}</td>
          </tr>
          <tr>
            <td className="details-label">Age</td>
            <td className="details-value">{calculateAge(player.DOB)}</td>
          </tr>
          <tr>
            <td className="details-label">Teams</td>
            {/* <td className="details-value">{player.join(",")}</td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PlayerDetail;
