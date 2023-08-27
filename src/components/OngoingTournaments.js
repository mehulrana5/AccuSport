import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../Context';
import '../css/OngoingTournaments.css';

const OngoingTournaments = () => {
  const { dummyData } = useContext(AppContext);
  const [isJoinActive, setIsJoinActive] = useState(false);

  const ongoingTournaments = dummyData.tournamentDetails.filter(tournament => tournament.status === 'ongoing');

  return (
    <div className="tournaments">
      <h3>Ongoing Tournaments</h3>
      {ongoingTournaments.map((tournament) => (
        <div className="tournament-card" key={tournament.id}>
          <span className="tournament-details">
            <strong>Name:</strong> {tournament.name}
          </span>
          <span className="tournament-details">
            <strong>Sport:</strong> {tournament.sportsType}
          </span>
          <span className="tournament-details">
            <strong>Date:</strong> {new Date(tournament.startDateTime).toLocaleDateString()}
          </span>
          <span className="show-details-button">
            <Link key={tournament.id} to={`/tournaments/${tournament.id}`}>Show Details</Link>
          </span>
          {isJoinActive ? ( // Conditionally render the Link
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

export default OngoingTournaments;
