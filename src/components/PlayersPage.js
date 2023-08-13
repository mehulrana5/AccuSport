import React from 'react';
import { Outlet } from 'react-router-dom';
import '../css/TeamsPage.css';
import PlayerFilter from './PlayerFilter';

function PlayersPage() {
    return (
        <div className="teams-page">
            <PlayerFilter/>
            <div className="teams-list">
                <Outlet/>
            </div>
        </div>
    );
}

export default PlayersPage;
