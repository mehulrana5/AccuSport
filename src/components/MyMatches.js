import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../Context'
import { useNavigate } from 'react-router-dom';

function MyMatches() {

    const context = useContext(AppContext)

    const [matches, setMatches] = useState();
    const [teams, setTeams] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        if (context.playerInfo._id) {
            context.fetchMatches(context.playerInfo._id, "player").then((data) => {
                setMatches(data)
            })
        }
        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        if (matches) {
            const fetchTeams = async () => {
                const teamPromises = matches.map(async (match) => {
                    const team1 = await context.fetchTeam(match.teams[0], "id");
                    const team2 = await context.fetchTeam(match.teams[1], "id");
                    return { team1, team2 };
                });

                const teamsData = await Promise.all(teamPromises);
                setTeams(teamsData);
            };

            fetchTeams();
        }
        // eslint-disable-next-line
    }, [matches]);

    useEffect(() => {
        // console.log(teams);
    }, [teams])

    function handelMatch(operation,match,teams){
        navigate(`../${operation}/${match._id}`,{state:{match,teams}})
    }

    return (
        <div className="container-2">
            <h1>My Matches</h1>
            {
                matches && teams && matches.map((match, idx) => (
                    <div key={idx} className="card">
                        <div style={{ width: "40%", display: "flex", justifyContent: "space-around" }}>
                            <div>
                                {teams[idx].team1.team_name}
                            </div>
                            <h3>VS</h3>
                            <div>
                                {teams[idx].team2.team_name}
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="green-btn"
                                onClick={() => handelMatch("view",match,teams[idx],teams[idx+1])}
                            >
                                View
                            </button>
                            <button
                                type="button"
                                className="blue-btn"
                                onClick={() => handelMatch("update",match,teams[idx],teams[idx+1])}
                            >
                                Update
                            </button> 
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default MyMatches