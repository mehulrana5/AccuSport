import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../Context';
import '../css/MatchDetails.css';

const MatchDetails = () => {
    const { matchId } = useParams(); // Get the matchId from the URL params
    const { dummyTournaments } = useContext(AppContext); // Get the dummyTournaments from context

    // Find the match details based on matchId
    const matchDetails = dummyTournaments
        .flatMap(tournament => tournament.matches)
        .find(match => match.id === parseInt(matchId));

    // If matchDetails is not found, display an error message
    if (!matchDetails) {
        return <div className="match-details">Match not found.</div>;
    }

    // Find the tournament details based on the match's tournamentId
    const tournament = dummyTournaments.find(tournament =>
        tournament.matches.some(match => match.id === parseInt(matchId))
    );

    return (
        <div className="match-details">
            <h2>Match Details</h2>
            <p>Date: {matchDetails.date}</p>
            <p>Time: {matchDetails.time}</p>
            <p>Venue: {matchDetails.venue}</p>
            
            {/* Display tournament-specific information */}
            {tournament && (
                <div>
                    <h3>Tournament: {tournament.name}</h3>
                    <p>Sport Type: {tournament.sportsType}</p>
                    <p>Start Date: {tournament.startDate}</p>
                    <p>Location: {tournament.location}</p>
                    
                    {/* Display different details based on tournament status */}
                    {tournament.status === 'upcoming' && (
                        <div>
                            <p>Status: Upcoming</p>
                            {/* Display upcoming-specific details here */}
                        </div>
                    )}
                    {tournament.status === 'ongoing' && (
                        <div>
                            <p>Status: Ongoing</p>
                            {/* Display ongoing-specific details here */}
                            <p>Teams: {matchDetails.teams.join(' vs ')}</p>
                            <p>
                                Live Stream:{' '}
                                <a href={matchDetails.liveStream} target="_blank" rel="noopener noreferrer">
                                    {matchDetails.liveStream}
                                </a>
                            </p>
                        </div>
                    )}
                    {tournament.status === 'old' && (
                        <div>
                            <p>Status: Old</p>
                            {/* Display old tournament-specific details here */}
                            <p>Final Score: {matchDetails.finalScore}</p>
                        </div>
                    )}
                    
                    {/* Display more tournament details as needed */}
                </div>
            )}
        </div>
    );
};

export default MatchDetails;
