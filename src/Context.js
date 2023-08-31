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
    user_name: "",
    user_role: []
  });

  const [playerInfo, setPlayerInfo] = useState({
    user_id: "", // Assign the user ID to the player's user_id field
    player_name: "",
    player_dob: "",
    team_ids: [],
    _id: ""
  });
  const [myTeams, setMyTeams] = useState([])


  // ------------------functions--------------------------
  const login = async (user_name, user_pwd) => {
    try {
      const response = await fetch(`${ip}/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({
          user_name: user_name,
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
          user_name: cred.username,
          user_pwd: cred.password,
        }),
      });

      if (!response.ok) {
        // Handle non-successful responses, e.g., server error or bad request
        const errorData = await response.json();
        throw errorData.message
      }
      
      const data = await response.json();
      // console.log(data.authToken);
      if (response.status === 200) {
        console.log(data.authToken);
        setAuthToken(data.authToken);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };
  function logout() {
    setAuthToken("")
    setUserInfo({
      user_id: "",
      user_name: "",
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
  const fetchPlayerData = async () => {
    try {
      const response = await fetch(`${ip}/fetchPlayerProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: userInfo._id
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch player data");
      }

      const data = await response.json();
      setPlayerInfo(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
      // You might want to set an error state or handle the error in some way
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

      if (response.ok) {
        // const data = await response.json();
        await fetchMyTeams();
      } else {
        // Handle error response here
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error here
    }
  };
  const fetchMyTeams = async () => {
    const response = await fetch(`${ip}/fetchMyTeams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken
      },
    })
    const data = await response.json();
    setMyTeams(data);
  };
  const deleteMyTeam = async (tid) => {
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
      const data=await response.json();
      console.log(data);
      await fetchMyTeams();
    } catch (error) {
      console.log(error);
    }
  };
  const addPlayer = async (playerId, teamId) => {
    try {
      const response = await fetch(`${ip}/addPlayerToTeam`, {
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
        throw new Error("Failed to add player to team");
      }
  
      const data = await response.json();
      console.log(data); // Log the response data
    } catch (error) {
      console.error("Error adding player to team:", error);
      // Handle the error here, such as showing an error message to the user
    }
  };
  

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
      fetchPlayerData()
    }
    if (authToken && userInfo.user_role.includes("teamLeader")) {
      fetchMyTeams()
    }
    // eslint-disable-next-line
  }, [userInfo])

  useEffect(() => {
    // console.log(playerInfo);
    // if (authToken){
    //   console.log(authToken);
    //   fetchUserData().then(data => {
    //     setUserInfo({
    //       user_id: data._id,
    //       user_name: data.user_name,
    //       user_role: data.user_role
    //     });
    //   }).catch(error => {
    //     console.error('Error:', error);
    //   });
    // }
    // eslint-disable-next-line
  }, [playerInfo])

  useEffect(() => {
    // console.log(myTeams);
    // eslint-disable-next-line
  }, [myTeams])

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
      value={{ active, setActive, dummyData, authToken, setAuthToken, userInfo, setUserInfo, playerInfo, setPlayerInfo, login, logout, register, createPlayer, createTeam, myTeams, setMyTeams, fetchMyTeams, deleteMyTeam ,addPlayer}}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
