import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const TournamentsPage = () => {

  const navigate=useNavigate();

  function handelBtn(path){
    navigate(`${path}`)
  }
  return (
    <div className="tournaments-page">
      <div className="tournament-buttons">
        <button className="blue-btn" onClick={()=>handelBtn('/tournaments/ongoing')}>Ongoing Tournaments</button>
        <button className="blue-btn" onClick={()=>handelBtn('/tournaments/upcoming')}>Upcoming Tournaments</button>
        <button className="blue-btn" onClick={()=>handelBtn('/tournaments/old')}>Old Tournaments</button>
        <button className='green-btn' onClick={()=>handelBtn('/createTournament')}>Create tournament</button>
      </div>
      <div className="tournament-container">
        <Outlet />
      </div>
    </div>
  );
};

export default TournamentsPage;
