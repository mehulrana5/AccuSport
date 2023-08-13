import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import '../css/TeamInfo.css';
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
        <div className="team-info">
            <h1 className="page-title">Team Info</h1>
            <table className="team-table">
                <tbody>
                    <tr>
                        <td className="table-label">Team ID:</td>
                        <td className="table-value">{teamId}</td>
                    </tr>
                    <tr>
                        <td className="table-label">Team Name:</td>
                        <td className="table-value">{teamData.name}</td>
                    </tr>
                    {/* Add more rows for other team details */}
                </tbody>
            </table>
        </div>
    );
}

export default TeamInfo;
