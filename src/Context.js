import React, { createContext, useEffect, useState } from 'react';
// Create a new context
const AppContext = createContext();

// Create a provider component to wrap the app with
export const AppProvider = ({ children }) => {

  const port = 3002;

  const ip = `http://localhost:${port}`;

  const [authToken, setAuthToken] = useState("");

  const [userInfo, setUserInfo] = useState({
    _id: "",
    user_email: "",
    user_role: []
  });

  const [playerInfo, setPlayerInfo] = useState({
    user_id: "", // Assign the user ID to the player's user_id field
    player_name: "",
    player_dob: "",
    team_ids: [],
    _id: ""
  });

  // ------------------functions--------------------------
  const login = async (user_email, user_pwd) => {
    try {
      const response = await fetch(`${ip}/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({
          user_email: user_email,
          user_pwd: user_pwd,
        }), // Convert data to JSON string
      });

      const token = await response.json();
      // console.log(token);
      setAuthToken(token.jwtToken);
      // Assuming you'll update state or context with the token here 
    } catch (error) {
      // Handle errors here
      console.error('Error during login:', error);
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${ip}/fetchUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        }
      });
      const data = await response.json();
      setUserInfo(data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  const register = async (cred) => {
    try {
      const response = await fetch(`${ip}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: cred.email,
          user_pwd: cred.password,
        }),
      });

      const data = await response.json();
      // console.log(data);
      if (response.status === 200) {
        setAuthToken(data.authToken);
      }
      else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  function logout() {
    setAuthToken("")
    setUserInfo({
      user_id: "",
      user_email: "",
      user_role: []
    })
    setPlayerInfo({
      user_id: "", // Assign the user ID to the player's user_id field
      player_name: "",
      player_dob: "",
      team_ids: [],
      _id: ""
    })
    setAuthToken("");
    window.location.reload();
  }

  //Player
  const fetchPlayers = async (query, fetchBy) => { //fetchBy=user,name,id,team
    try {
      const response = await fetch(`${ip}/fetchPlayers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query,
          fetchBy: fetchBy
        })
      });

      const data = await response.json();

      return data;

    } catch (error) {
      console.error(error);
    }
  };

  const createPlayer = async (cred) => {
    try {
      const response = await fetch(`${ip}/registerPlayer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify(cred)
      });

      if (response.ok) {
        const data = await response.json();
        setPlayerInfo(data);
        fetchUserData();
        // Handle successful response here
      } else {
        // Handle error response here
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error here
    }
  };

  //Team
  const createTeam = async (team) => {
    try {
      const response = await fetch(`${ip}/createTeam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify(team)
      });
      const data = await response.json();
      if (response.ok) {
        await fetchTeam(userInfo._id, "user");
      }
      else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const deleteTeam = async (tid) => {
    try {
      const response = await fetch(`${ip}/deleteTeam`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify({
          team_id: tid
        })
      })
      const data = await response.json();
      return data;
      // await fetchTeam(userInfo._id, "user");
    } catch (error) {
      console.log(error);
    }
  };
  const updateTeamPlayers = async (players, teamId) => {
    try {
      const response = await fetch(`${ip}/updateTeamPlayers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify({
          players: players,
          teamId: teamId
        })
      })
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  const fetchTeam = async (query, fetchBy) => {
    try {
      const response = await fetch(`${ip}/fetchTeam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query,
          fetchBy: fetchBy
        })
      })
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  //Torunament
  const createTournament = async (data) => {
    try {
      if (!data.match_admins.includes(userInfo._id)) {
        data.match_admins.push(userInfo._id);
      }
      const response = await fetch(`${ip}/createTournament`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify(data)
      })
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  }
  const fetchTournament = async (query, fetchBy) => {
    try {
      const response = await fetch(`${ip}/fetchTournament`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, fetchBy }),
      });

      if (!response.ok) {
        throw new Error(`Fetch request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };
  const updateTournament = async (data) => {
    try {
      console.log(data.start_date_time);
      const response = await fetch(`${ip}/updateTournament/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify({
          tournament_status: data.tournament_status,
          start_date_time: data.start_date_time,
          description: data.description,
          match_admins: data.match_admins
        })
      })
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  }
  const deleteTournament = async (pid) => {
    try {
      const response = await fetch(`${ip}/deleteTournament`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify({ tournamentId: pid })
      })
      const data = await response.json();
      return data

    } catch (error) {
      console.log(error);
    }
  }
  //Match
  const createMatch = async (data) => {
    try {
      const response = await fetch(`${ip}/createMatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify({
          tournament_id: data.tournamentId, // Fixed typo here
          match_start_date_time: data.matchStartDateTime,
          match_end_date_time: data.matchEndDateTime,
          description: data.matchDescription,
          teams: [data.team1, data.team2],
          OLC: data.locationId,
        })
      });

      const json = await response.json();
      return { data: json, status: response.status };
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMatches = async (query, fetchBy) => {
    try {
      const response = await fetch(`${ip}/fetchMatches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query,
          fetchBy: fetchBy
        })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  //Performance
  const createDataPoints = async (data) => {
    try {
      const response = await fetch(`${ip}/createDataPoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify(data)
      })
      const json = await response.json();
      return json
    } catch (error) {
      console.log(error);
    }
  }
  const fetchDataPoints = async (tournament_id) => {
    try {
      const response = await fetch(`${ip}/fetchDataPoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tournament_id }) // Wrap tournament_id in an object
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Error in fetchDataPoints:', error);
    }
  }
  const updateDataPoints=async(data)=>{
    try {
      const response = await fetch(`${ip}/updateDataPoints`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify(data)
      })
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  }
  // ------------------Use Effects--------------------------
  useEffect(() => {
    if (authToken) {
      console.log(authToken);
      fetchUserData()
    }
    // eslint-disable-next-line
  }, [authToken])

  useEffect(() => {
    if (authToken && userInfo.user_role.includes("player")) {
      fetchPlayers(userInfo._id, "user").then((data) => { setPlayerInfo(data[0]) })
    }
    // eslint-disable-next-line
  }, [userInfo])

  useEffect(() => {
    // console.log(playerInfo);
  }, [playerInfo])

  // Define the state and functions you want to provide
  const [active, setActive] = useState(0);
  // You can add more state and functions here 
  // api.js 

  return (
    <AppContext.Provider
      value={{
        active,
        setActive,
        authToken,
        setAuthToken,
        userInfo,
        setUserInfo,
        playerInfo,
        setPlayerInfo,
        login,
        logout,
        register,
        createPlayer,
        createTeam,
        deleteTeam,
        fetchTeam,
        fetchPlayers,
        createTournament,
        fetchTournament,
        updateTournament,
        deleteTournament,
        createMatch,
        fetchMatches,
        updateTeamPlayers,
        createDataPoints,
        fetchDataPoints,
        updateDataPoints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
