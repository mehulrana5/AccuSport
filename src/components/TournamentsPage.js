import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../css/TournamentsPage.css';

const TournamentsPage = () => {

  return (
    <div className="tournaments-page">
      <div className="tournament-buttons">
        <Link
          className="tournament-button"
          to=""
        >
          Ongoing Tournaments
        </Link>
        <Link
          className="tournament-button"
          to="upcoming"
        >
          Upcoming Tournaments
        </Link>
        <Link
          className="tournament-button"
          to="old"
        >
          Old Tournaments
        </Link>
        <Link className='create-btn tournament-button' to='/tournament/create'>
          Create tournament
        </Link>
      </div>
      <div className="tournament-container">
        <Outlet />
      </div>
    </div>
  );
};

export default TournamentsPage;
