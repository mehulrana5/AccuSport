import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../Context';

const TournamentCards = () => {
  const context = useContext(AppContext);

  const { status } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState([])

  const handelBtn = (path) => {
    navigate(path);
  };

  async function fetchTournament(status) {
    const res = await context.fetchTournament(status,"status");
    setData(res);
  }

  useEffect(() => {
    if (status) {
      fetchTournament(status)
    }
  }, [status])

  useEffect(() => {
    // console.log(data);
  }, [data])

  // const ongoingTournaments = dummyData.tournamentDetails.filter(
  //   (tournament) => tournament.status === status
  // );

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
        {data && data.map((e, idx) => (
          <div className="card" key={idx}>
            <div>
              {e.tournament_name}
            </div>
            <div>
              {e.sport_type}
            </div>
            <div>
              {new Date(e.start_date_time).toLocaleString()}
            </div>
            <div>
              <button className='green-btn' onClick={() => handelBtn(`../view/${e._id}`)}>
                View
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TournamentCards;
