import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../Context';

const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const context = useContext(AppContext);
  const selectedTournament = context.dummyTournaments.find(tournament => tournament.id === parseInt(tournamentId));

  if (!selectedTournament) {
    return <div>Tournament not found</div>;
  }
  return (
    <div className="tournament-details-page">
      <h2>{selectedTournament.name || 'Not specified'}</h2>
      <div className="details-tables-container">
        <div className="tournament-details-table-container">
          <h3>Tournament Details</h3>
          <table className="tournament-details-table">
            <tbody>
              <tr>
                <th>Sport:</th>
                <td>{selectedTournament.sportsType || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Date:</th>
                <td>{selectedTournament.startDate || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Time:</th>
                <td>{selectedTournament.startTime || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Location:</th>
                <td>{selectedTournament.location || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>{selectedTournament.status}</td>
              </tr>
              <tr>
                <th>Description:</th>
                <td>{selectedTournament.description || 'No description available'}</td>
              </tr>
              <tr>
                <th>Organizer:</th>
                <td>{selectedTournament.organizer.name || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Contact Email:</th>
                <td>{selectedTournament.organizer.contactEmail || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Contact Phone:</th>
                <td>{selectedTournament.organizer.contactPhone || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Max Prize:</th>
                <td>{selectedTournament.prizes[0].amount || 'Not specified'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="matches-table-container">
          <h3>Matches</h3>
          <table className="matches-table">
            <thead>
              <tr>
                <th>S no.</th>
                <th>Team 1</th>
                <th>Team 2</th>
                <th>View details</th>
              </tr>
            </thead>
            <tbody>
              {selectedTournament.matches.map((match, index) => (
               <tr key={index}>
               <td>{index + 1}</td>
               <td>{match.teams[0] || 'Not specified'}</td>
               <td>{match.teams[1] || 'Not specified'}</td>
               <td>
                 {/* Use Link to navigate to the match details page */}
                 <Link to={`/matches/${match.id}`}>Details</Link>
               </td>
             </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



export default TournamentDetails;
