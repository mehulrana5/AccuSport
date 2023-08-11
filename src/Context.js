
import React, { createContext, useState } from 'react';
// Create a new context
const AppContext = createContext();

// Create a provider component to wrap the app with
export const AppProvider = ({ children }) => {
  const dummyTournaments = [
    {
      "id": 1,
      "name": "Summer Championship",
      "status": "upcoming",
      "sportsType": "Football",
      "startDate": "10-08-2023",
      "startTime": "17:30",
      "location": "Noida",
      "description": "An exciting football championship to celebrate the summer season.",
      "organizer": {
        "name": "Sports Association",
        "contactEmail": "info@sportsassociation.com",
        "contactPhone": "+1 (123) 456-7890"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$1000",
          "details": "Cash prize for the winning team"
        },
        {
          "place": 2,
          "amount": "$500",
          "details": "Cash prize for the runner-up team"
        }
      ],
      "teams": [
        {
          "id": 101,
          "name": "Team A",
          "players": [
            {
              "id": 201,
              "name": "Player 1",
              "position": "Forward"
            },
            // More players...
          ]
        },
        {
          "id": 102,
          "name": "Team B",
          "players": [
            {
              "id": 202,
              "name": "Player 1",
              "position": "Midfielder"
            },
            // More players...
          ]
        },
        // More teams...
      ],
      "matches": [
        {
          "id": 301,
          "date": "10-08-2023",
          "time": "17:30",
          "teams": ["Team A", "Team B"],
          "venue": "Stadium A",
          "liveStream": "https://example.com/live-stream-match-301"
        },
        {
          "id": 302,
          "date": "12-08-2023",
          "time": "18:00",
          "teams": ["Team B", "Team C"],
          "venue": "Stadium B",
          "liveStream": "https://example.com/live-stream-match-302"
        },
        // More matches...
      ],
      "rules": "Standard football rules apply. Each match consists of two halves...",
      "sponsors": [
        {
          "name": "ABC Sports",
          "logo": "https://example.com/abc-sports-logo.png",
          "website": "https://www.abcsports.com"
        },
        // More sponsors...
      ],
      "socialMedia": {
        "facebook": "https://www.facebook.com/summerchampionship",
        "twitter": "https://www.twitter.com/summerchamp",
        "instagram": "https://www.instagram.com/summer_championship"
      } 
    },
    {
      "id": 2,
      "name": "Spring Cup",
      "status": "upcoming",
      "sportsType": "Tennis",
      "startDate": "05-09-2023",
      "startTime": "10:00",
      "location": "London",
      "description": "A spring-themed tennis tournament for all skill levels.",
      "organizer": {
        "name": "Tennis Federation",
        "contactEmail": "info@tennisfederation.com",
        "contactPhone": "+1 (987) 654-3210"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$800",
          "details": "Cash prize for the singles winner"
        },
        {
          "place": 2,
          "amount": "$400",
          "details": "Cash prize for the runner-up"
        }
      ],
      "teams": [],
      "matches": [],
      "rules": "Players must adhere to standard tennis rules and sportsmanship.",
      "sponsors": [],
      "socialMedia": {
        "facebook": "https://www.facebook.com/springcup",
        "twitter": "https://www.twitter.com/springcup",
        "instagram": "https://www.instagram.com/spring_cup"
      }
    },
    {
      "id": 3,
      "name": "Winter Games",
      "status": "upcoming",
      "sportsType": "Ice Hockey",
      "startDate": "15-12-2023",
      "startTime": "19:30",
      "location": "Toronto",
      "description": "An exciting ice hockey tournament during the winter season.",
      "organizer": {
        "name": "Hockey Association",
        "contactEmail": "info@hockeyassociation.com",
        "contactPhone": "+1 (555) 123-4567"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$1200",
          "details": "Cash prize for the winning team"
        },
        {
          "place": 2,
          "amount": "$600",
          "details": "Cash prize for the runner-up team"
        }
      ],
      "teams": [],
      "matches": [],
      "rules": "Matches consist of three periods. Teams compete to score goals...",
      "sponsors": [],
      "socialMedia": {
        "facebook": "https://www.facebook.com/wintergames",
        "twitter": "https://www.twitter.com/wintergames",
        "instagram": "https://www.instagram.com/winter_games"
      }
    },
    {
      "id": 4,
      "name": "Autumn Open",
      "status": "old",
      "sportsType": "Golf",
      "startDate": "20-11-2022",
      "startTime": "08:00",
      "location": "Scottsdale",
      "description": "An annual golf tournament held during the autumn season.",
      "organizer": {
        "name": "Golf Club",
        "contactEmail": "info@golfclub.com",
        "contactPhone": "+1 (888) 567-8901"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$1500",
          "details": "Cash prize for the winner"
        },
        {
          "place": 2,
          "amount": "$800",
          "details": "Cash prize for the runner-up"
        }
      ],
      "teams": [],
      "matches": [],
      "rules": "Players must follow golf etiquette and rules. Lowest score wins.",
      "sponsors": [],
      "socialMedia": {
        "facebook": "https://www.facebook.com/autumnopen",
        "twitter": "https://www.twitter.com/autumnopen",
        "instagram": "https://www.instagram.com/autumn_open"
      }
    },
    {
      "id": 5,
      "name": "Winter Marathon",
      "status": "old",
      "sportsType": "Running",
      "startDate": "12-01-2022",
      "startTime": "07:00",
      "location": "New York City",
      "description": "A marathon race held in the heart of winter.",
      "organizer": {
        "name": "Running Club",
        "contactEmail": "info@runningclub.com",
        "contactPhone": "+1 (777) 888-9999"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$1000",
          "details": "Cash prize for the winner"
        },
        {
          "place": 2,
          "amount": "$500",
          "details": "Cash prize for the second place"
        }
      ],
      "teams": [],
      "matches": [],
      "rules": "Participants must complete the specified route within the time limit...",
      "sponsors": [],
      "socialMedia": {
        "facebook": "https://www.facebook.com/wintermarathon",
        "twitter": "https://www.twitter.com/wintermarathon",
        "instagram": "https://www.instagram.com/winter_marathon"
      }
    },
    {
      "id": 6,
      "name": "Spring Volleyball Clash",
      "status": "old",
      "sportsType": "Volleyball",
      "startDate": "02-04-2022",
      "startTime": "14:00",
      "location": "Los Angeles",
      "description": "An exciting volleyball tournament to welcome the spring season.",
      "organizer": {
        "name": "Volleyball Association",
        "contactEmail": "info@volleyballassociation.com",
        "contactPhone": "+1 (123) 456-7890"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$800",
          "details": "Cash prize for the winning team"
        },
        {
          "place": 2,
          "amount": "$400",
          "details": "Cash prize for the runner-up team"
        }
      ],
      "teams": [],
      "matches": [],
      "rules": "Teams compete in best-of-five sets. A set is won by the team...",
      "sponsors": [],
      "socialMedia": {
        "facebook": "https://www.facebook.com/springvolleyballclash",
        "twitter": "https://www.twitter.com/springvolleyball",
        "instagram": "https://www.instagram.com/spring_volleyball"
      }
    },
    {
      "id": 7,
      "name": "Winter Classic",
      "status": "ongoing",
      "sportsType": "Hockey",
      "startDate": "15-12-2023",
      "startTime": "19:00",
      "location": "Toronto",
      "description": "An exhilarating hockey championship to embrace the winter spirit.",
      "organizer": {
        "name": "Hockey Federation",
        "contactEmail": "info@hockeyfederation.com",
        "contactPhone": "+1 (987) 654-3210"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$1500",
          "details": "Cash prize for the championship-winning team"
        },
        {
          "place": 2,
          "amount": "$750",
          "details": "Cash prize for the runner-up team"
        }
      ],
      "teams": [
        {
          "id": 201,
          "name": "Team X",
          "players": [
            {
              "id": 401,
              "name": "Jhon",
              "position": "Defenseman"
            },
            // More players...
          ]
        },
        {
          "id": 202,
          "name": "Team Y",
          "players": [
            {
              "id": 402,
              "name": "Ayush",
              "position": "Forward"
            },
            // More players...
          ]
        },
        // More teams...
      ],
      "matches": [
        {
          "id": 501,
          "date": "15-12-2023",
          "time": "19:00",
          "teams": ["Team X", "Team Y"],
          "venue": "Ice Arena A",
          "liveStream": "https://example.com/live-stream-match-501"
        },
        {
          "id": 502,
          "date": "18-12-2023",
          "time": "18:30",
          "teams": ["Team Y", "Team Z"],
          "venue": "Ice Arena B",
          "liveStream": "https://example.com/live-stream-match-502"
        },
        // More matches...
      ],
      "rules": "Standard hockey rules apply. Each match consists of three periods...",
      "sponsors": [
        {
          "name": "IceGear",
          "logo": "https://example.com/icegear-logo.png",
          "website": "https://www.icegear.com"
        },
        // More sponsors...
      ],
      "socialMedia": {
        "facebook": "https://www.facebook.com/winterclassic",
        "twitter": "https://www.twitter.com/winterclassic",
        "instagram": "https://www.instagram.com/winter_classic"
      }
    },
    {
      "id": 8,
      "name": "Spring Tennis Open",
      "status": "upcoming",
      "sportsType": "Tennis",
      "startDate": "05-04-2023",
      "startTime": "09:00",
      "location": "Miami",
      "description": "A thrilling tennis tournament to welcome the spring season.",
      "organizer": {
        "name": "Tennis Association",
        "contactEmail": "info@tennisassociation.com",
        "contactPhone": "+1 (555) 123-4567"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$2000",
          "details": "Cash prize for the singles champion"
        },
        {
          "place": 2,
          "amount": "$1000",
          "details": "Cash prize for the singles runner-up"
        }
      ],
      "teams": [],
      "matches": [
        {
          "id": 601,
          "date": "05-04-2023",
          "time": "09:00",
          "players": ["Player A", "Player B"],
          "venue": "Tennis Court A",
          "liveStream": "https://example.com/live-stream-match-601"
        },
        {
          "id": 602,
          "date": "08-04-2023",
          "time": "10:30",
          "players": ["Player C", "Player D"],
          "venue": "Tennis Court B",
          "liveStream": "https://example.com/live-stream-match-602"
        },
        // More matches...
      ],
      "rules": "Standard tennis rules apply. Matches are best of five sets...",
      "sponsors": [
        {
          "name": "TennisGear",
          "logo": "https://example.com/tennisgear-logo.png",
          "website": "https://www.tennisgear.com"
        },
        // More sponsors...
      ],
      "socialMedia": {
        "facebook": "https://www.facebook.com/springtennisopen",
        "twitter": "https://www.twitter.com/springtennis",
        "instagram": "https://www.instagram.com/spring_tennis_open"
      }
    },
    {
      "id": 4,
      "name": "Autumn Open",
      "status": "old",
      "sportsType": "Golf",
      "startDate": "20-11-2022",
      "startTime": "08:00",
      "location": "Scottsdale",
      "description": "An annual golf tournament held during the autumn season.",
      "organizer": {
        "name": "Golf Club",
        "contactEmail": "info@golfclub.com",
        "contactPhone": "+1 (888) 567-8901"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$1500",
          "details": "Cash prize for the winner"
        },
        {
          "place": 2,
          "amount": "$800",
          "details": "Cash prize for the runner-up"
        }
      ],
      "teams": [],
      "matches": [],
      "rules": "Players must follow golf etiquette and rules. Lowest score wins.",
      "sponsors": [],
      "socialMedia": {
        "facebook": "https://www.facebook.com/autumnopen",
        "twitter": "https://www.twitter.com/autumnopen",
        "instagram": "https://www.instagram.com/autumn_open"
      }
    },
    {
      "id": 5,
      "name": "Winter Marathon",
      "status": "old",
      "sportsType": "Running",
      "startDate": "12-01-2022",
      "startTime": "07:00",
      "location": "New York City",
      "description": "A marathon race held in the heart of winter.",
      "organizer": {
        "name": "Running Club",
        "contactEmail": "info@runningclub.com",
        "contactPhone": "+1 (777) 888-9999"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$1000",
          "details": "Cash prize for the winner"
        },
        {
          "place": 2,
          "amount": "$500",
          "details": "Cash prize for the second place"
        }
      ],
      "teams": [],
      "matches": [],
      "rules": "Participants must complete the specified route within the time limit...",
      "sponsors": [],
      "socialMedia": {
        "facebook": "https://www.facebook.com/wintermarathon",
        "twitter": "https://www.twitter.com/wintermarathon",
        "instagram": "https://www.instagram.com/winter_marathon"
      }
    },
    {
      "id": 6,
      "name": "Spring Volleyball Clash",
      "status": "old",
      "sportsType": "Volleyball",
      "startDate": "02-04-2022",
      "startTime": "14:00",
      "location": "Los Angeles",
      "description": "An exciting volleyball tournament to welcome the spring season.",
      "organizer": {
        "name": "Volleyball Association",
        "contactEmail": "info@volleyballassociation.com",
        "contactPhone": "+1 (123) 456-7890"
      },
      "prizes": [
        {
          "place": 1,
          "amount": "$800",
          "details": "Cash prize for the winning team"
        },
        {
          "place": 2,
          "amount": "$400",
          "details": "Cash prize for the runner-up team"
        }
      ],
      "teams": [],
      "matches": [],
      "rules": "Teams compete in best-of-five sets. A set is won by the team...",
      "sponsors": [],
      "socialMedia": {
        "facebook": "https://www.facebook.com/springvolleyballclash",
        "twitter": "https://www.twitter.com/springvolleyball",
        "instagram": "https://www.instagram.com/spring_volleyball"
      }
    }
  ];
  // Define the state and functions you want to provide
  const [active,setActive]=useState(0);
  // You can add more state and functions here
  // api.js

  return (
    <AppContext.Provider
      value={{dummyTournaments,active,setActive}}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
