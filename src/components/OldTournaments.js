import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../Context';

const OldTournaments = () => {
  const { dummyData } = useContext(AppContext);
  const [isJoinActive, setIsJoinActive] = useState(false); // Add state for the button

  const oldTournaments = dummyData.tournamentDetails.filter(tournament => tournament.status === 'old');

  return (
    <div className="tournaments">
      <h3>Old Tournaments</h3>
      {oldTournaments.map((tournament) => (
        <div className="tournament-card" key={tournament.id}>
          <span className="tournament-details">
            <strong>Name:</strong> {tournament.name}
          </span>
          <span className="tournament-details">
            <strong>Sport:</strong> {tournament.sportsType}
          </span>
          <span className="tournament-details">
            <strong>Date:</strong> {tournament.startDate}
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

export default OldTournaments;
