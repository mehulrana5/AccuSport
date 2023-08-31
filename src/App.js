import React from 'react';
import './App.css';

import HomePage from './components/HomePage';
import TournamentsPage from './components/TournamentsPage';
import TournamentCards from './components/TournamentCards';
import NavBar from './components/NavBar';
import TournamentDetails from './components/TournamentDetails';
import MatchDetails from './components/MatchDetails';
import PlayerDetail from './components/PlayerDetail';
import TeamsPage from './components/TeamsPage';
import TeamInfo from './components/TeamDetails';
import MatchesPage from './components/MatchesPage';
import PlayersPage from './components/PlayersPage';
import MyDetails from './components/MyDetails';

// eslint-disable-next-line
import { Routes, Route,HashRouter ,BrowserRouter, Outlet} from 'react-router-dom';

// i am not sure but i am using the hashRouter cause it will not make server request for each route like localhost:3000/#/matches in this case the localhost:3000 will be given at the backend but not the /matches it will be the responsibility of the client side routing currently i am using the auth 0 for authorization but ig in fiture i will try to add my own authentication technique

//in case u wanna add the browser router then add the basename /AccuSport in <Routes> as the github repo name is AccuSport 

//the main issue was with the use of basename and auth 0 idk exactly but there is a issue with the path so thats y i am using hashrouter 

import { AppProvider } from './Context';
import Login from './components/Login';
import Signup from './components/Signup';
import CreatePlayer from './components/CreatePlayer';
import CreateTeam from './components/CreateTeam';

const App = () => {

  return (
    <AppProvider>
      <HashRouter>
        <NavBar />
        <Outlet/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>

          <Route path="/players" element={<PlayersPage />}>
            <Route path=':playerId' element={<PlayerDetail />} />
          </Route>
          <Route path="/player/:playerId" element={<PlayerDetail />} />
          <Route path="/createPlayer" element={<CreatePlayer/>}/>

          <Route path="/myProfile" element={<MyDetails/>}/>

          <Route path="createTeam" exact element={<CreateTeam/>} />
          
          <Route path="/teams" exact element={<TeamsPage />}>
            <Route path=":teamId" exact element={<TeamInfo />} />
          </Route>
          <Route path="/team-info/:teamId" exact element={<TeamInfo />} />
          
          <Route path="/match-info/:matchId" element={<MatchDetails />} />

          <Route path="/matches" element={<MatchesPage />}>
            <Route path=':matchId' element={<MatchDetails />} />
          </Route>

          <Route path="/tournaments/" element={<TournamentsPage />}>
            <Route path=":status" element={<TournamentCards />}/>
            <Route path=":status/:tournamentId" element={<TournamentDetails/>} />
          </Route>


          <Route path="/betting" element={<HomePage />} />

        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App; 
