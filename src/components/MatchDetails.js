import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../Context';
import '../css/MatchDetails.css';

const MatchDetails = () => {
    const { matchId } = useParams();
    const { dummyTournaments } = useContext(AppContext);

    const tournament = dummyTournaments.find(tournament =>
        tournament.matches.some(match => match.id === parseInt(matchId))
    );

    if (!tournament) {
        return <div className="match-details match-not-found">Match not found.</div>;
    }

    const { teams, name, id, location, venue, sportsType, date, time, status, score } = tournament;
    const team1Players = teams[0].players;
    const team2Players = teams[1].players;
    const maxPlayers = Math.max(team1Players.length, team2Players.length);

    return (
        <div className="match-details-container">
            <div className="match-details-left">
                <h2 className="match-details-header">{name}</h2>
                <h3 className="match-details-header">Match Details</h3>
                <p className="match-details-item">Match ID: {id}</p>
                <p className="match-details-item">Location: {location}</p>
                <p className="match-details-item">Venue: {venue}</p>
                <p className="match-details-item">Sport: {sportsType}</p>
                <p className="match-details-item">Date: {date}</p>
                <p className="match-details-item">Time: {time}</p>
                <p className="match-details-item">Status: {status}</p>
                <p className="match-details-item">Score: {score || 'Not specified'}</p>
                {/* <p className="match-details-item">Bet: {bet || 'Not specified'}</p> */}
                {status === 'upcoming' ? <div className="match-status upcoming"></div> : null}
                {status === 'ongoing' ? <div className="match-status ongoing"></div> : null}
                {status === 'old' ? <div className="match-status old"></div> : null}
            </div>
            <div className="match-details-right">
                <table className="players-table">
                    <thead>
                        <tr>
                            <th className="team-name">{teams[0].name}</th>
                            <th className="team-name">{teams[1].name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(maxPlayers)].map((_, playerIndex) => (
                            <tr key={playerIndex}>
                                <td className="player-name">
                                    {playerIndex < team1Players.length ? team1Players[playerIndex].name : '-'}
                                </td>
                                <td className="player-name">
                                    {playerIndex < team2Players.length ? team2Players[playerIndex].name : '-'}
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
