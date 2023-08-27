import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../Context';

const UpcomingTournaments = () => {
  const { dummyData } = useContext(AppContext);
  const [isJoinActive, setIsJoinActive] = useState(true); // Add state for the button

  const upcomingTournaments = dummyData.tournamentDetails.filter(tournament => tournament.status === 'upcoming');

  return (
    <div className="tournaments">
      <h3>Upcoming Tournaments</h3>
      {upcomingTournaments.map((tournament) => (
        <div className="tournament-card" key={tournament.id}>
          <span className="tournament-details">
            <strong>Name:</strong> {tournament.name}
          </span>
          <span className="tournament-details">
            <strong>Sport:</strong> {tournament.sportsType}
          </span>
          <span className="tournament-details">
            <strong>Date:</strong>{new Date(tournament.startDateTime).toLocaleDateString()}
          </span>
          <span className="show-details-button">
            <Link key={tournament.id} to={`/tournaments/${tournament.id}`}>Show Details</Link>
          </span>
          {isJoinActive ? ( // Conditionally render the Join button
            <Link
              className={`join-button active`}
              to={`/join-tournament/${tournament.id}`}
              onClick={() => setIsJoinActive(false)}
            >
              Join
            </Link>
          ) : (
            <button
              className={`join-button inactive`}
              disabled
            >
              Join
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UpcomingTournaments;
