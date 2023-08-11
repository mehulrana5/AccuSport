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

const App = () => {
  return (
    <BrowserRouter basename='/AccuSport'>
      <AppProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/tournaments/" element={<TournamentsPage />}>
            <Route path="" element={<OngoingTournaments />} />
            <Route path="upcoming" element={<UpcomingTournaments />} />
            <Route path="old" element={<OldTournaments />} />
            <Route path=":tournamentId" element={<TournamentDetails />} />
          </Route>
          <Route path="/matches/:matchId" element={<MatchDetails />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
