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
    <div className="container-4">
      <h2>{selectedTournament.name || 'Not specified'}</h2>
      <div className="container-5">
        <div className="container-5">
          <table className="details-table">
            <tbody>
              <tr>
                <td className="details-label">Id:</td>
                <td className="details-value">{selectedTournament.id || 'Not specified'}</td>
              </tr>
              <tr>
                <td className="details-label">Sport:</td>
                <td className="details-value">{selectedTournament.sportsType || 'Not specified'}</td>
              </tr>
              <tr>
                <td className="details-label">Date:</td>
                <td className="details-value">{new Date(selectedTournament.startDateTime).toLocaleDateString() || 'Not specified'}</td>
              </tr>
              <tr>
                <td className="details-label">Time:</td>
                <td className="details-value">{new Date(selectedTournament.startDateTime).toLocaleTimeString() || 'Not specified'}</td>
              </tr>
              <tr>
                <td className="details-label">Location:</td>
                <td className="details-value">{selectedTournament.location || 'Not specified'}</td>
              </tr>
              <tr>
                <td className="details-label">Status:</td>
                <td className="details-value">{selectedTournament.status}</td>
              </tr>
              <tr>
                <td className="details-label">Description:</td>
                <td className="details-value">{selectedTournament.description || 'No description available'}</td>
              </tr>
              <tr>
                <td className="details-label">Organizer:</td>
                <td className="details-value">{context.dummyData.organizerDetails[0].name || 'Not specified'}</td>
              </tr>
              <tr>
                <td className="details-label">Contact Email:</td>
                <td className="details-value">{context.dummyData.organizerDetails[0].contactEmail || 'Not specified'}</td>
              </tr>
              <tr>
                <td className="details-label">Contact Phone:</td>
                <td className="details-value">{context.dummyData.organizerDetails[0].contactPhone || 'Not specified'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="container-2">
          <h3>Matches</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th className="table-head">S no.</th>
                <th className="table-head">Team 1</th>
                <th className="table-head">Team 2</th>
                <th className="table-head">View details</th>
              </tr>
            </thead>
            <tbody>
              {context.dummyData.matchDetails
                .filter(match => match.tournament_id === selectedTournament.id) // Filter matches for the selected tournament
                .map((match, index) => (
                  <tr key={index}>
                    <td className="details-value">{index + 1}</td>
                    <td className="details-value">
                      {context.dummyData.teamDetails.find(team => team.id === match.teamId1)?.name ||
                        'Not specified'}
                    </td>
                    <td className="details-value">
                      {context.dummyData.teamDetails.find(team => team.id === match.teamId2)?.name ||
                        'Not specified'}
                    </td>
                    <td className="details-value">
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
