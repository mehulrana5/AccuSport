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

  useEffect(() => {
    if (status) {
      context.fetchTournament(status,"status").then((res)=>{setData(res)})
    }
    // eslint-disable-next-line
  }, [status])

  return (
    <div className="">
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
              <h3>
                {e.tournament_name}
              </h3>
            </div>
            <div>
              {e.sport_type}
            </div>
            <div>
              {new Date(e.start_date_time).toLocaleDateString('en-GB')}
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
