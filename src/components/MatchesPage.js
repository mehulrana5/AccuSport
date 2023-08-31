import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function MatchesPage() {
    const [matchIdFilter, setmatchIdFilter] = useState('');
    const navigate = useNavigate();
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (matchIdFilter) {
            navigate(`/matches/${matchIdFilter}`);
        }
    };
    return (
        <div className="container-1">
            <div>
                <h2>Match filter</h2>
                <div className="team-filter">
                    <form onSubmit={handleFilterSubmit}>
                        <label>
                            Match ID:
                            <input
                                type="text"
                                value={matchIdFilter}
                                onChange={(e) => setmatchIdFilter(e.target.value)}
                            />
                        </label>
                        <div className="container-2">
                            <button className='blue-btn' type="submit">Apply Filter</button>
                            <Link to='../createMatch'>
                                <button className='green-btn'>
                                    Create match
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default MatchesPage;
