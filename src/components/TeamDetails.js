import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../Context';

function TeamInfo() {
    const { teamId } = useParams();
    const { dummyData } = useContext(AppContext);

    // Find the team data based on teamId from dummyData
    const teamData = dummyData.teamDetails.find((team) => team.id === parseInt(teamId));

    if (!teamData) {
        return <p className="team-not-found">Team not found.</p>;
    }

    return (
        <div className="container-2" style={{width:"20%"}}>
            <h1 className="page-title">{teamData.name}</h1>
            <table className="details-table">
                <tbody>
                    <tr>
                        <td className="details-label">Team ID:</td>
                        <td className="details-value">{teamId}</td>
                    </tr>
                    {/* Add more rows for other team details */}
                </tbody>
            </table>
        </div>
    );
}

export default TeamInfo;
