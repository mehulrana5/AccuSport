import React, { useContext, useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import AppContext from '../Context';

function TeamsPage() {
    const [teamIdFilter, setTeamIdFilter] = useState('');
    
    const context = useContext(AppContext)
    const navigate=useNavigate();
    
    const [player,setPlayer] =useState(false);

    useEffect(()=>{
        setPlayer(context.userInfo.user_role.includes("player"));
    },[context.userInfo,context.playerInfo])

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (teamIdFilter) {
            navigate(`/teams/${teamIdFilter}`);
        }
    };
    return (
        <div className="container-1">
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
                    <div className="container-2">
                        <button className='blue-btn' type="submit">Apply Filter</button>
                        <Link to={player?'../createTeam':'../login'}>
                            <button className='green-btn'>
                                Create team
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
            <Outlet />
        </div>
    );
}

export default TeamsPage;
