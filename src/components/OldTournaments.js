import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../Context';

const OldTournaments = () => {
  const context = useContext(AppContext); // Get tournaments data from context

  const oldTournaments = context.dummyTournaments.filter(tournament => tournament.status === 'old');

  return (
    <div className="tournaments">
      <h3>Old Tournaments</h3>
      {oldTournaments.map((tournament) => (
        <Link
          key={tournament.id}
          className="tournament-card"
          to={`/tournaments/${tournament.id}`} // Link to tournament details
        >
          <span className="tournament-details">
            <strong>Name:</strong> {tournament.name}
          </span>
          <span className="tournament-details">
            <strong>Sport:</strong> {tournament.sportsType}
          </span>
          <span className="tournament-details">
            <strong>Date:</strong> {tournament.startDate}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default OldTournaments;
