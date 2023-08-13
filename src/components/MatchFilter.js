import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MatchFilter() {

    const [matchIdFilter, setmatchIdFilter] = useState('');

    const navigate = useNavigate();

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (matchIdFilter) {
            navigate(`/matches/${matchIdFilter}`);
        }
    };

    return (
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
                    <button type="submit">Apply Filter</button>
                </form>
            </div>
        </div>
    );
}

export default MatchFilter;
