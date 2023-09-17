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

  const addPlayer = async (query, teamId) => {
    try {
      const response = await fetch(`${ip}/addPlayerToTeam`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({
          query: query,
          team_id: teamId,
        }),
      });

      const data = await response.json();
      return data; // Log the response data
    } catch (error) {
      console.error(error);
    }
  };

  const removePlayer = async (playerId, teamId) => {
    try {
      const response = await fetch(`${ip}/removePlayerFromTeam`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({
          player_id: playerId,
          team_id: teamId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove player from team");
      }

      // const data = await response.json();
    } catch (error) {
      console.error("Error in removing player from team:", error);
      // Handle the error here, such as showing an error message to the user
    }
  };

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
          query:query,
          fetchBy:fetchBy
        })
      });
      const data=await response.json();
      return data;
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
  // ----------------------------------------------------------

  const myDetails = [
    {
      _id: 1,
      name: 'ABC',
      DOB: 'DD-MM-YYYY',
      teamsId: [],
      teamAdmin: [],
      matchAdmin: [],
      torAdmin: []
    },
  ]
  const tournamentDetails = [
    // old
    {
      id: 3,
      name: "Summer Championship",
      status: "old",
      sportsType: "Hockey",
      startDateTime: "2023-09-06T13:30:00",
      location: "Noida",
      description: "An exciting Hockey championship to celebrate the summer season.",
      organizer_id: 1,
      rules: "Standard Hockey rules apply.",
    },
    // oncoming
    {
      id: 2,
      name: "Summer Championship",
      status: "ongoing",
      sportsType: "BasketBall",
      startDateTime: "2023-07-10T17:30:00",
      location: "Noida",
      description: "An exciting BasketBall championship to celebrate the summer season.",
      organizer_id: 1,
      rules: "Standard BasketBall rules apply.",
    },
    // upcoming
    {
      id: 1,
      name: "Summer Championship",
      status: "upcoming",
      sportsType: "Football",
      startDateTime: "2023-08-10T17:30:00",
      location: "Noida",
      description: "An exciting football championship to celebrate the summer season.",
      organizer_id: 1,
      rules: "Standard football rules apply.",
    },
  ];
  const organizerDetails = [
    {
      id: 1,
      name: "Sports Association",
      contactEmail: "info@sportsassociation.com",
      contactPhone: "+1 (123) 456-7890",
    },
  ];
  const teamDetails = [
    {
      id: 1,
      tournament_id: 1,
      name: "Team a",
      playersId: [1]
    },
    {
      id: 2,
      tournament_id: 1,
      name: "Team b",
      playersId: [2]
    },
  ];
  const matchDetails = [
    {
      id: 1,
      tournament_id: 1,
      date: "2023-08-10",
      time: "17:30",
      venue_id: 1,
      liveStream: "https://example.com/live-stream-1",
      teamId1: 1,
      teamId2: 2
    },
  ];
  const venueDetails = [
    {
      id: 1,
      name: "Stadium a",
      location: "a1"
    },
  ];
  const playerDetails = [
    {
      id: 1,
      team_ids: [1],
      name: "Player1",
      DOB: "2003-06-20T00:00",
      email: "player1@example.com",
      phoneNumber: "+1 (123) 111-1111",
    },
    {
      id: 2,
      team_ids: [2],
      name: "Player2",
      DOB: "2000-07-10",
      email: "player1@example.com",
      phoneNumber: "+1 (123) 111-1111",
    }
  ];
  const dummyData = { myDetails, tournamentDetails, organizerDetails, teamDetails, matchDetails, venueDetails, playerDetails }
  // You can now use these variables in your application.

  // Define the state and functions you want to provide
  const [active, setActive] = useState(0);
  // You can add more state and functions here 
  // api.js 

  return (
    <AppContext.Provider
      value={{
        active,
        setActive,
        dummyData,
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
        addPlayer,
        removePlayer,
        fetchTeam,
        fetchPlayers,
        createTournament,
        fetchTournament,
        updateTournament,
        deleteTournament,
        createMatch,
        fetchMatches, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
