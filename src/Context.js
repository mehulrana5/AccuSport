
import React, { createContext, useState } from 'react';
// Create a new context
const AppContext = createContext();

// Create a provider component to wrap the app with
export const AppProvider = ({ children }) => {
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
      value={{ active, setActive, dummyData }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
