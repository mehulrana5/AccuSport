import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TournamentsPage from './components/TournamentsPage';
import OngoingTournaments from './components/OngoingTournaments';
import UpcomingTournaments from './components/UpcomingTournaments';
import OldTournaments from './components/OldTournaments';
import NavBar from './components/NavBar';
import { AppProvider } from './Context';
import TournamentDetails from './components/TournamentDetails';
import MatchDetails from './components/MatchDetails';
import PlayerDetail from './components/PlayerDetail';
import TeamsPage from './components/TeamsPage';
import TeamInfo from './components/TeamInfo';
import MatchesPage from './components/MatchesPage';
import PlayersPage from './components/PlayersPage';

const App = () => {
  return (
    <BrowserRouter basename='/AccuSport'>
      <AppProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matches" element={<MatchesPage/>}>
            <Route path=':matchId' element={<MatchDetails/>}/>
          </Route>
          <Route path="/players" element={<PlayersPage/>}>
            <Route path=':playerId' element={<PlayerDetail/>}/>
          </Route>
          <Route path="/betting" element={<HomePage />} />
          <Route path="/tournaments/" element={<TournamentsPage />}>
            <Route path="" element={<OngoingTournaments />} />
            <Route path="upcoming" element={<UpcomingTournaments />} />
            <Route path="old" element={<OldTournaments />} />
            <Route path=":tournamentId" element={<TournamentDetails />} />
          </Route>
          <Route path="/teams" exact element={<TeamsPage />}>
            <Route path=":teamId" exact element={<TeamInfo />} />
          </Route>
          <Route path="/team-info/:teamId" exact element={<TeamInfo />} />
          <Route path="/matches/:matchId" element={<MatchDetails />} />
          <Route path="/player/:playerId" element={<PlayerDetail />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
