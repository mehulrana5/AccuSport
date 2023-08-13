import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PlayerFilter() {

    const [playerIdFilter, setPlayerIdFilter] = useState('');

    const navigate = useNavigate();

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (playerIdFilter) {
            navigate(`/players/${playerIdFilter}`);
        }
    };

    return (
        <div>
            <h2>Player filter</h2>
            <div className="team-filter">
                <form onSubmit={handleFilterSubmit}>
                    <label>
                        Player ID:
                        <input type="text" value={playerIdFilter} onChange={(e) => setPlayerIdFilter(e.target.value)}/>
                    </label>
                    <button type="submit">Apply Filter</button>
                </form>
            </div>
        </div>
    );
}

export default PlayerFilter;
