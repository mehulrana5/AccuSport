import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../Context';

const MatchDetails = () => {
    const { matchId } = useParams();
    const context = useContext(AppContext);
    const dummyData = context.dummyData;

    const [matchData, setMatchData] = useState(null);

    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                // Replace this with your actual API call to fetch match details based on matchId
                const response = await fetch(`API_URL/${matchId}`);
                const data = await response.json();
                setMatchData(data);
            } catch (error) {
                // If the API call fails, fall back to dummyData match details
                const fallbackMatch = dummyData.matchDetails.find(match => match.id === parseInt(matchId));
                setMatchData(fallbackMatch);
            }
        };
        fetchMatchDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchId]);

    if (!matchData) {
        return <div className="match-details match-not-found">Loading...</div>;
    }

    const { id, date, time, venue_id, liveStream, teamId1, teamId2 } = matchData;

    const venue = dummyData.venueDetails.find(venue => venue.id === venue_id).name;
    const status = dummyData.tournamentDetails.find(tournament => tournament.id === id).status;
    const tournamentName=dummyData.tournamentDetails.find(tournament => tournament.id === id).name;


    const team1 = dummyData.teamDetails.find(team => team.id === teamId1);
    const team2 = dummyData.teamDetails.find(team => team.id === teamId2);
    
    const team1Players = dummyData.playerDetails.filter(player => player.team_ids.includes(teamId1));
    const team2Players = dummyData.playerDetails.filter(player => player.team_ids.includes(teamId2));


    const maxPlayers = Math.max(team1Players.length, team2Players.length);
    return (
        <div className="container-3">
            <div className="container-2">
                <h2>{tournamentName}</h2>
                <table className="details-table">
                    <tbody>
                        <tr>
                            <td className="details-label">Match ID</td>
                            <td className="details-value">{id}</td>
                        </tr>
                        <tr>
                            <td className="details-label">Date</td>
                            <td className="details-value">{date}</td>
                        </tr>
                        <tr>
                            <td className="details-label">Time</td>
                            <td className="details-value">{time}</td>
                        </tr>
                        <tr>
                            <td className="details-label">Venue</td>
                            <td className="details-value">{venue}</td>
                        </tr>
                        <tr>
                            <td className="details-label">Live Stream</td>
                            <td className="details-value"><a href={liveStream} target="_blank" rel="noopener noreferrer">Watch Here</a></td>
                        </tr>
                        {status === 'upcoming' ? <tr className="match-status upcoming">

                        </tr> : null}
                        {status === 'ongoing' ? <tr className="match-status ongoing">

                        </tr> : null}
                        {status === 'old' ? <tr className="match-status old">

                        </tr> : null}
                    </tbody>
                </table>
            </div>
            <div style={{marginRight:"10px"}}></div>
            <div className="container-2">
                <h2>Teams</h2>
                <table className="details-table">
                    <thead>
                        <tr>
                            <th className="table-head"><Link to={`/team-info/${team1.id}`}>{team1Players.length > 0 ? team1.name : ''}</Link></th>
                            <th className="table-head"><Link to={`/team-info/${team2.id}`}>{team2Players.length > 0 ? team2.name : ''}</Link></th>
                        </tr> 
                    </thead>
                    <tbody>
                        {[...Array(maxPlayers)].map((_, playerIndex) => (
                            <tr key={playerIndex}>
                                <td className="details-value">
                                    {playerIndex < team1Players.length ? (
                                        <Link to={`/player/${team1Players[playerIndex].id}`}>
                                            {team1Players[playerIndex].name}
                                        </Link> 
                                    ) : '-'}
                                </td>
                                <td className="details-value">
                                    {playerIndex < team2Players.length ? (
                                        <Link to={`/player/${team2Players[playerIndex].id}`}>
                                            {team2Players[playerIndex].name}
                                        </Link>
                                    ) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default MatchDetails;
