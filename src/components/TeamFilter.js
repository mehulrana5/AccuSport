import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeamFilter() {

    const [teamIdFilter, setTeamIdFilter] = useState('');

    const navigate = useNavigate();

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (teamIdFilter) {
            navigate(`/teams/${teamIdFilter}`);
        }
    };

    return (
        <div>
            <h2>Team filter</h2>
            <div className="team-filter">
                <form onSubmit={handleFilterSubmit}>
                    <label>
                        Team ID:
                        <input
                            type="text"
                            value={teamIdFilter}
                            onChange={(e) => setTeamIdFilter(e.target.value)}
                        />
                    </label>
                    <button type="submit">Apply Filter</button>
                </form>
            </div>
        </div>
    );
}

export default TeamFilter;
