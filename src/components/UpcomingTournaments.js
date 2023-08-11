import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../Context';

const UpcomingTournaments = () => {
  const context = useContext(AppContext); // Get tournaments data from context

  const upcomingTournaments = context.dummyTournaments.filter(tournament => tournament.status === 'upcoming');

  return (
    <div className="tournaments">
      <h3>Upcoming Tournaments</h3>
      {upcomingTournaments.map((tournament) => (
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

export default UpcomingTournaments;
