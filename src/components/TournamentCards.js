import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../Context';

const TournamentCards = () => {
  const { dummyData } = useContext(AppContext);

  const { status } = useParams();

  const navigate = useNavigate();

  const handelBtn = (path) => {
    navigate(path);
  };

  const ongoingTournaments = dummyData.tournamentDetails.filter(
    (tournament) => tournament.status === status
  );

  return (
    <div className="container-4">
      <h1>
        {status === 'ongoing'
          ? 'On Going'
          : status === 'upcoming'
            ? 'Up Coming'
            : status === 'old'
              ? 'Old'
              : ''}{' '}
        Tournaments
      </h1>
      <div className="container-2">
        {ongoingTournaments.map((tournament) => (
          <div className="card" key={tournament.id}>
            <h3>{tournament.name}</h3>
            <div>
              Sport:{tournament.sportsType}
            </div>
            <div>
              Date:{new Date(tournament.startDateTime).toLocaleDateString()}
            </div>
            <div>
              <button className="blue-btn" onClick={() => handelBtn(`./${tournament.id}`)}>
                Show Details
              </button>
              <button className='green-btn'
                onClick={() => handelBtn(`/join-tournament/${tournament.id}`)}>
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TournamentCards;
