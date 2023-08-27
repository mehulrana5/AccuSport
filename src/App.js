import React from 'react';
import './App.css';

import HomePage from './components/HomePage';
import TournamentsPage from './components/TournamentsPage';
import OngoingTournaments from './components/OngoingTournaments';
import UpcomingTournaments from './components/UpcomingTournaments';
import OldTournaments from './components/OldTournaments';
import NavBar from './components/NavBar';
import TournamentDetails from './components/TournamentDetails';
import MatchDetails from './components/MatchDetails';
import PlayerDetail from './components/PlayerDetail';
import TeamsPage from './components/TeamsPage';
import TeamInfo from './components/TeamInfo';
import MatchesPage from './components/MatchesPage';
import PlayersPage from './components/PlayersPage';
import MyDetails from './components/MyDetails';

// eslint-disable-next-line
import { Routes, Route,HashRouter ,BrowserRouter} from 'react-router-dom';

// i am not sure but i am using the hashRouter cause it will not make server request for each route like localhost:3000/#/matches in this case the localhost:3000 will be given at the backend but not the /matches it will be the responsibility of the client side routing currently i am using the auth 0 for authorization but ig in fiture i will try to add my own authentication technique

//in case u wanna add the browser router then add the basename /AccuSport in <Routes> as the github repo name is AccuSport 

//the main issue was with the use of basename and auth 0 idk exactly but there is a issue with the path so thats y i am using hashrouter 

import { AppProvider } from './Context';
import CreateTournamentPage from './components/CreateTournamentPage';
import TeamCreateForm from './components/TeamCreateForm';

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matches" element={<MatchesPage />}>
            <Route path=':matchId' element={<MatchDetails />} />
          </Route>
          <Route path="/players" element={<PlayersPage />}>
            <Route path=':playerId' element={<PlayerDetail />} />
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
            <Route path='create' element={<TeamCreateForm/>}/>   
          </Route>
          <Route path="/team-info/:teamId" exact element={<TeamInfo />} />
          <Route path="/match-info/:matchId" element={<MatchDetails />} />
          <Route path="/player/:playerId" element={<PlayerDetail />} />
          <Route path="/myProfile" element={<MyDetails/>} /> 
          <Route path="/tournament/create" element={<CreateTournamentPage/>}/>      
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
