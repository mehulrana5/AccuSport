import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppContext from '../Context';

function TeamsPage() {
    
    const [teamIdFilter, setTeamIdFilter] = useState('');

    const context = useContext(AppContext)

    const navigate = useNavigate();

    const [player, setPlayer] = useState(false);

    useEffect(() => {
        setPlayer(context.userInfo.user_role.includes("player"));
    }, [context.userInfo, context.playerInfo])

    const handleFilterSubmit = (e) => {
        e.preventDefault()
        if (teamIdFilter) {
            navigate(`/teams/view/${teamIdFilter}`);
        }
    };
    return (
        <div className='container-1'>
            <div>
                <form onSubmit={handleFilterSubmit}>
                    <input
                        type="text"
                        className='form-input'
                        value={teamIdFilter}
                        onChange={(e) => setTeamIdFilter(e.target.value)}
                    />
                    <button className='blue-btn' type="submit">Search</button>
                    <div>
                        <button className='green-btn' onClick={()=>navigate(player?'./createTeam':'../login')}>Create team</button>
                        <button className='blue-btn' onClick={()=>navigate(player?'./myTeams':'../login')}>My team</button>
                    </div>
                </form>
            </div>
            <Outlet />
        </div>
    );
}

export default TeamsPage;