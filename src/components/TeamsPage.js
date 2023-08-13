import React from 'react';
import { Outlet } from 'react-router-dom';
import TeamFilter from './TeamFilter';
import '../css/TeamsPage.css'; // Import your custom CSS file for styling

function TeamsPage() {
    return (
        <div className="teams-page">
            <TeamFilter />
            <div className="teams-list">
                <Outlet />
            </div>
        </div>
    );
}

export default TeamsPage;
