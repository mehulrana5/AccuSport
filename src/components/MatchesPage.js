import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppContext from '../Context';

function MatchesPage() {
    const context = useContext(AppContext)


    const [isPlayer, setIsPlayer] = useState(false);

    const [matchIdFilter, setmatchIdFilter] = useState('');
    const navigate = useNavigate();
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (matchIdFilter) {
            navigate(`/matches/${matchIdFilter}`);
        }
    };
    useEffect(() => {
        if (context.userInfo.user_role.includes("player")) setIsPlayer(true);
        else setIsPlayer(false);
        // eslint-disable-next-line
    }, [])
    return (
        <div className="container-1">
            <div className="container-2">
                <form onSubmit={handleFilterSubmit}>
                    <div>
                        <input
                            type="text"
                            className='form-input'
                            value={matchIdFilter}
                            onChange={(e) => setmatchIdFilter(e.target.value)}
                        />
                        <button className='blue-btn' type="submit">Apply Filter</button>
                    </div>
                    <div>
                        <button className='blue-btn' onClick={() => navigate(isPlayer ? './myMatches' : '../login')}>
                            Manage
                        </button>
                        <button className='blue-btn' onClick={() => navigate(isPlayer ? './createMatch' : '../login')} >
                            Play
                        </button>
                        <button className='green-btn' onClick={() => navigate(isPlayer ? './createMatch' : '../login')} >
                            Create
                        </button>
                    </div>
                </form>
            </div>
            <Outlet />
        </div>
    );
}

export default MatchesPage;
