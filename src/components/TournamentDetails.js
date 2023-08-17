import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../Context';

const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const context = useContext(AppContext);
  const selectedTournament = context.dummyData.tournamentDetails.find(tournament => tournament.id === parseInt(tournamentId));
  // const prizeList=context.dummyData.prizeDetails.find()
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
                <th>Id:</th>
                <td>{selectedTournament.id || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Sport:</th>
                <td>{selectedTournament.sportsType || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Date:</th>
                <td>{selectedTournament.startDateTime || 'Not specified'}</td>
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
                <td>{context.dummyData.organizerDetails[0].name || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Contact Email:</th>
                <td>{context.dummyData.organizerDetails[0].contactEmail || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Contact Phone:</th>
                <td>{context.dummyData.organizerDetails[0].contactPhone || 'Not specified'}</td>
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
              {context.dummyData.matchDetails
                .filter(match => match.tournament_id === selectedTournament.id) // Filter matches for the selected tournament
                .map((match, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {context.dummyData.teamDetails.find(team => team.id === match.teamId1)?.name ||
                        'Not specified'}
                    </td>
                    <td>
                      {context.dummyData.teamDetails.find(team => team.id === match.teamId2)?.name ||
                        'Not specified'}
                    </td>
                    <td>
                      {/* Use Link to navigate to the match details page */}
                      <Link to={`/match-info/${match.id}`}>Details</Link>
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
