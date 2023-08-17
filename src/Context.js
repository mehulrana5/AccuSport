
import React, { createContext, useState } from 'react';
// Create a new context
const AppContext = createContext();

// Create a provider component to wrap the app with
export const AppProvider = ({ children }) => {
  const tournamentDetails = [
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
    {
      id: 2,
      name: "Basketball Slam Jam",
      status: "ongoing",
      sportsType: "Basketball",
      startDateTime: "2023-07-20T14:00:00",
      location: "Los Angeles",
      description: "A high-flying basketball tournament showcasing amazing slam dunks.",
      organizer_id: 2,
      rules: "Teams of 5, first to 21 points wins.",
    },
    {
      id: 3,
      name: "Winter Classic Tennis",
      status: "upcoming",
      sportsType: "Tennis",
      startDateTime: "2023-12-01T10:00:00",
      location: "New York City",
      description: "A prestigious tennis tournament held in the heart of winter.",
      organizer_id: 3,
      rules: "Best of 3 sets, tie-breaker at 6-6.",
    },
    {
      id: 4,
      name: "Chess Grandmaster Challenge",
      status: "old",
      sportsType: "Chess",
      startDateTime: "2023-03-15T09:00:00",
      location: "London",
      description: "An intense chess tournament for the best minds in the game.",
      organizer_id: 4,
      rules: "Standard chess rules apply.",
    },
    {
      id: 5,
      name: "VolleyMania",
      status: "upcoming",
      sportsType: "Volleyball",
      startDateTime: "2023-09-05T13:15:00",
      location: "Rio de Janeiro",
      description: "A beach volleyball championship with a carnival atmosphere.",
      organizer_id: 5,
      rules: "Teams of 2, first to 15 points, best of 3 sets.",
    },
    {
      id: 6,
      name: "Golf Masters",
      status: "upcoming",
      sportsType: "Golf",
      startDateTime: "2023-10-15T08:00:00",
      location: "Augusta",
      description: "A prestigious golf tournament featuring top players from around the world.",
      organizer_id: 6,
      rules: "18 holes, stroke play.",
    },
    {
      id: 7,
      name: "Swimming Splash Bash",
      status: "ongoing",
      sportsType: "Swimming",
      startDateTime: "2023-07-10T09:30:00",
      location: "Miami",
      description: "A thrilling swimming competition with various distance events.",
      organizer_id: 7,
      rules: "Freestyle, backstroke, butterfly, and breaststroke events.",
    },
    {
      id: 8,
      name: "Rugby Rumble",
      status: "upcoming",
      sportsType: "Rugby",
      startDateTime: "2023-11-20T13:00:00",
      location: "Sydney",
      description: "An intense rugby tournament showcasing the power and skill of the players.",
      organizer_id: 8,
      rules: "15 players per team, try scoring and kicking.",
    },
    {
      id: 9,
      name: "Badminton Bonanza",
      status: "upcoming",
      sportsType: "Badminton",
      startDateTime: "2023-09-25T11:00:00",
      location: "Bangkok",
      description: "A fast-paced badminton championship with singles and doubles matches.",
      organizer_id: 9,
      rules: "Best of three games, rally scoring.",
    },
    {
      id: 10,
      name: "Cycling Challenge",
      status: "ongoing",
      sportsType: "Cycling",
      startDateTime: "2023-08-05T15:45:00",
      location: "Paris",
      description: "A thrilling cycling race through scenic routes in the city.",
      organizer_id: 10,
      rules: "Road race, various distances.",
    }, 
    {
      id: 11,
      name: "Grand Slam Tennis",
      status: "old",
      sportsType: "Tennis",
      startDateTime: "2023-02-10T09:00:00",
      location: "Melbourne",
      description: "A historic tennis tournament featuring the world's top players.",
      organizer_id: 11,
      rules: "Best of five sets, tie-breakers in final set.",
    },
    {
      id: 12,
      name: "Classic Chess Championship",
      status: "old",
      sportsType: "Chess",
      startDateTime: "2023-04-22T10:30:00",
      location: "New Delhi",
      description: "A prestigious chess championship showcasing strategic brilliance.",
      organizer_id: 12,
      rules: "Standard chess rules apply, round-robin format.",
    },
    {
      id: 13,
      name: "Equestrian Elegance",
      status: "old",
      sportsType: "Equestrian",
      startDateTime: "2023-03-05T13:15:00",
      location: "London",
      description: "A showcase of horsemanship and graceful riding in various disciplines.",
      organizer_id: 13,
      rules: "Jumping, dressage, and cross-country events.",
    },
    {
      id: 14,
      name: "Archery Archangel",
      status: "old",
      sportsType: "Archery",
      startDateTime: "2023-01-15T08:45:00",
      location: "Tokyo",
      description: "A precision archery tournament featuring marksmanship skills.",
      organizer_id: 14,
      rules: "Recurve and compound bow divisions, various target distances.",
    },
    {
      id: 15,
      name: "Sailing Spectacular",
      status: "old",
      sportsType: "Sailing",
      startDateTime: "2023-05-30T11:00:00",
      location: "Auckland",
      description: "A sailing regatta showcasing agility and strategy on the water.",
      organizer_id: 15,
      rules: "Various boat classes, race around buoys.",
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
  const prizeDetails = [
    {
      id: 1,
      tournament_id: 1,
      place: 1,
      amount: "$1000",
      details: "Cash prize for the winning team",
    },
    {
      id: 2,
      tournament_id: 1,
      place: 2,
      amount: "$500",
      details: "Cash prize for the runner-up team",
    },
  ];
  const teamDetails = [
    { id: 1, tournament_id: 1, name: "Team A" },
    { id: 2, tournament_id: 1, name: "Team B" },
  ];
  const matchDetails = [
    {
      id: 1,
      tournament_id: 1,
      date: "2023-08-10",
      time: "17:30",
      venue_id: 1,
      liveStream: "https://example.com/live-stream-1",
      teamId1:1,
      teamId2:2
    },
  ];
  const venueDetails = [
    { id: 1, name: "Stadium A", location: "Noida" },
  ];
    const playerDetails = [
    {
      id: 1,
      team_ids: [1],
      name: "Player1",
      age: 25,
      email: "player1@example.com",
      phoneNumber: "+1 (123) 111-1111",
    },
    {
      id: 2,
      team_ids: [1],
      name: "Player2",
      age: 28,
      email: "player2@example.com",
      phoneNumber: "+1 (123) 222-2222",
    },
    {
      id: 3,
      team_ids: [2],
      name: "Player3",
      age: 24,
      email: "player3@example.com",
      phoneNumber: "+1 (123) 333-3333",
    },
    {
      id: 4,
      team_ids: [2],
      name: "Player4",
      age: 26,
      email: "player4@example.com",
      phoneNumber: "+1 (123) 444-4444",
    },
  ];
  const sponsorDetails = [
    {
      id: 1,
      tournament_id: 1,
      name: "ABC Sports",
      logo: "https://example.com/abc-sports-logo.png",
      website: "https://www.abcsports.com",
    },
  ];
  const socialMediaDetails = [
    {
      id: 1,
      tournament_id: 1,
      facebook: "https://www.facebook.com/summerchampionship",
      twitter: "https://www.twitter.com/summerchamp",
      instagram: "https://www.instagram.com/summer_championship",
    },
  ];
  const dummyData={tournamentDetails,organizerDetails,prizeDetails,teamDetails,matchDetails,venueDetails,playerDetails,sponsorDetails,socialMediaDetails}
  // You can now use these variables in your application.

  // Define the state and functions you want to provide
  const [active, setActive] = useState(0);
  // You can add more state and functions here 
  // api.js

  return (
    <AppContext.Provider
      value={{active, setActive , dummyData }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
