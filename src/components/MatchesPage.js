import React from 'react';
import { Outlet } from 'react-router-dom';
import MatchFilter from './MatchFilter';
import '../css/TeamsPage.css';

function MatchesPage() {
    return (
        <div className="teams-page">
            <MatchFilter/>
            <div className="teams-list">
                <Outlet/>
            </div>
        </div>
    );
}

export default MatchesPage;
