import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate=useNavigate();
   return (
    <div className="container-1" style={{display:"flex",flexDirection:"column"}}>
      <h1>Welcome to Accu Sport Management System</h1>
      <p>
        The Accu sport management system is a web application designed to manage Sports teams,
        tournaments, matches, and player profiles. It provides a user-friendly interface for
        creating/joining teams, organizing/participating in tournaments, viewing match schedules,
        and analyzing player statistics, placing bets on teams.
      </p>
      <div>
        <button className='blue-btn' onClick={()=>navigate(`./teams`)}>
          Create or Join a Team
        </button>
        <button className='blue-btn' onClick={()=>navigate(`./tournaments`)}>
          Explore Tournaments
        </button>
        <button className='blue-btn' onClick={()=>navigate(`./matches`)}>
          View Match Schedules
        </button>
        <button className='blue-btn' onClick={()=>navigate(`./players`)}>
          Analyze Player Statistics
        </button>
        <button className='blue-btn' onClick={()=>navigate(`./betting`)}>
          Place Bets on Teams
        </button>
      </div>
    </div>
  );
};

export default HomePage;
