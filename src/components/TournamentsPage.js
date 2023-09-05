import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppContext from '../Context';

const TournamentsPage = () => {

  const navigate=useNavigate();
  const context=useContext(AppContext)

  const [isPlayer,setIsPlayer]=useState(false);

  useEffect(()=>{
    setIsPlayer(context.userInfo.user_role.includes("player"))
  },[context.userInfo.user_role])

  function handelBtn(path){
    navigate(`${path}`)
  }
  return (
    <div className="tournaments-page">
      <div className="tournament-buttons">
        <button className="blue-btn" onClick={()=>handelBtn('/tournaments/ongoing')}>Ongoing Tournaments</button>
        <button className="blue-btn" onClick={()=>handelBtn('/tournaments/upcoming')}>Upcoming Tournaments</button>
        <button className="blue-btn" onClick={()=>handelBtn('/tournaments/old')}>Old Tournaments</button>
        <button className='green-btn' onClick={()=>handelBtn(isPlayer?'./createTournament':'../login')}>Create tournament</button>
      </div>
      <div className="tournament-container">
        <Outlet />
      </div>
    </div>
  );
};

export default TournamentsPage;
