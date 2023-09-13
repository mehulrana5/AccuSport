import React, { useContext, useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
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
    }, [])
    return (
        <div className="container-1">
            <div className="team-filter">
                <form style={{ display: "flex", flexDirection: "row", width: "90vw", alignItems: "center", }} onSubmit={handleFilterSubmit}>
                    <label>
                        <h3>ID:</h3>
                    </label>
                    <input
                        type="text"
                        value={matchIdFilter}
                        onChange={(e) => setmatchIdFilter(e.target.value)}
                    />
                    <div style={{ marginLeft: "5px" }} className="container-2">
                        <button className='blue-btn' type="submit">Apply Filter</button>
                        <Link to={isPlayer ? './myMatches' : '../login'}>
                            <button className='blue-btn'>
                                My matches
                            </button>
                        </Link>
                        <Link to={isPlayer ? './createMatch' : '../login'}>
                            <button className='green-btn'>
                                Create match
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
            <Outlet />
        </div>
    );
}

export default MatchesPage;
