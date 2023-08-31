import React, { useContext, useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import AppContext from '../Context';

function PlayersPage() {
    const context=useContext(AppContext)

    const [guest,setGuest] =useState(false);
    const [player,setPlayer] =useState(false);

    useEffect(()=>{
        setGuest(context.userInfo.user_role.includes("guest"));
        setPlayer(context.userInfo.user_role.includes("player"));
    },[context.userInfo,context.playerInfo])

    const [playerIdFilter, setPlayerIdFilter] = useState('');
    const navigate = useNavigate();
    
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (playerIdFilter) {
            navigate(`/players/${playerIdFilter}`);
        }
    };
    return (
        <div className="container-1">
            <div>
                <div className="team-filter">
                    <h2>Player filter</h2>
                    <form onSubmit={handleFilterSubmit}>
                        <label>
                            Player ID:
                            <input type="text" value={playerIdFilter} onChange={(e) => setPlayerIdFilter(e.target.value)}/>
                        </label>
                        <div className="container-2">
                            <button className='blue-btn' type="submit">Apply Filter</button>
                            {
                                !player?
                                <Link to={guest?"../createPlayer":"../login"}>
                                    <button className='green-btn'>
                                        Create player
                                    </button>
                                </Link>
                                :<></>
                            }
                        </div>
                    </form>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default PlayersPage;