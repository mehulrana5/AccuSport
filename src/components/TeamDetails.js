import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../Context';

function TeamInfo() {
    const { teamId } = useParams();
    const context = useContext(AppContext);
    const navigate=useNavigate();

    const [teamData, setTeamData] = useState(null);
    const [playerData, setPlayerData] = useState([]);
    const [canUpdate, setCanUpdate] = useState(false);
    const [refresh, setRefresh] = useState(1);

    useEffect(() => {
        async function fetchTeam() {
            try {
                // console.log(teamId);
                const data = await context.fetchTeams(teamId);
                setTeamData(data[0]);

                if (data[0].team_leader === context.userInfo._id) {
                    setCanUpdate(true);
                }
                else {
                    setCanUpdate(false)
                }
            } catch (error) {
                console.error(error);
                // Handle error here
            }
        }
        fetchTeam();
    // eslint-disable-next-line
    }, [context, teamId]);

    useEffect(() => {
        if (teamData) {
            if (teamData) {
                const playerIds = teamData.team_players_ids;
                async function fetchData() {
                    try {
                        const data = await context.fetchTeamPlayers(playerIds);
                        setPlayerData(data)
                        // Now you can set the player data in the state if needed
                    } catch (error) {
                        console.error(error);
                        // Handle any errors here
                    }
                }
                fetchData();
            }
        }
        // eslint-disable-next-line
    }, [teamData, refresh]);

    function handelAddPlayer() {
        const pid = prompt("enter player id")
        if (pid) {
            context.addPlayer(pid, teamData._id).then(() => {
                alert(`player ${pid} is added to team ${teamData._id}`)
                setRefresh(refresh === 1 ? 0 : 1);
            }
            )
        }
    }

    function handelRemovePlayer(pid, tid) {
        const flag = window.confirm(`Are you sure to remove ${pid} from ${tid}`)
        if (flag) {
            context.removePlayer(pid, tid);
            alert(`player ${pid} is removed from team ${tid}`)
            setRefresh(refresh === 1 ? 0 : 1);
        }
    }
    function handelPlayerDetails(pid){
        navigate(`../../player/${pid}`)
    }
    // console.log(teamData);  
    if (!teamData) {
        return <p className="team-not-found">Team not found.</p>;
    }
    return (
        <div className="container-2">
            <div className="container-2">
                <table className="details-table">
                    <tbody>
                        <tr>
                            <td className="details-label">Team ID</td>
                            <td className="details-value">
                                <input
                                    type="text"
                                    className='form-input'
                                    readOnly={true}
                                    value={teamData._id}
                                    style={{ width: "50%" }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="details-label">Team name</td>
                            <td className="details-value">
                                <input
                                    type="text"
                                    className='form-input'
                                    readOnly={true}
                                    value={teamData.team_name}
                                    style={{ width: "50%" }}
                                />
                            </td>
                        </tr>
                        <tr>

                        </tr>
                        {/* Add more rows for other team details */}
                    </tbody>

                </table>

            </div>
            <table className="">
                <thead>
                    <tr>
                        <th colSpan={canUpdate ? 4 : 2} className='table-head'>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {playerData.map((data, idx) => (
                        <tr key={idx}>
                            <td className='details-value'>
                                {data.player_name}
                            </td>
                            <td className=''>
                                <button onClick={() => handelPlayerDetails(data._id)} className='blue-btn'>
                                    Player Details
                                </button>
                            </td>
                            {
                                canUpdate ?
                                    <td className=''>
                                        <button onClick={() => handelRemovePlayer(data._id, teamData._id)} className="red-btn">
                                            Remove Player
                                        </button>
                                    </td> : <></>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                canUpdate ?
                    <button onClick={handelAddPlayer} className="green-btn">
                        Add Player
                    </button> : <></>
            }
        </div>
    );
}

export default TeamInfo;
