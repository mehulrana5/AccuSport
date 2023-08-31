import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const containerStyle = {
    backgroundColor: '#121212',
    color: '#FFFFFF',
    padding: '20px',
    textAlign: 'center',
    minHeight: '82vh', // Ensure the content takes at least the full viewport height
  };
  const headingStyle = {
    fontSize: '32px',
    marginBottom: '20px',
  };
  const paragraphStyle = {
    fontSize: '18px',
    marginBottom: '30px',
  };
  const quickLinksStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  };
  const linkStyle = {
    backgroundColor: '#2196F3',
    color: '#FFFFFF',
    textDecoration: 'none',
    padding: '10px 20px',
    margin: '10px',
    borderRadius: '5px',
    fontWeight: 'bold',
  };

  return (
    <div>
      <div style={containerStyle} className="home-content">
        <h1 style={headingStyle}>Welcome to Accu Sport Management System</h1>
        <p style={paragraphStyle}>
          The Accu sport management system is a web application designed to manage Sports teams,
          tournaments, matches, and player profiles. It provides a user-friendly interface for
          creating/joining teams, organizing/participating in tournaments, viewing match schedules,
          and analyzing player statistics, placing bets on teams.
        </p>
        <div style={quickLinksStyle} className="quick-links">
          <Link style={linkStyle} to="/teams">
            Create or Join a Team
          </Link>
          <Link style={linkStyle} to="/tournaments">
            Explore Tournaments
          </Link>
          <Link style={linkStyle} to="/matches">
            View Match Schedules
          </Link>
          <Link style={linkStyle} to="/players">
            Analyze Player Statistics
          </Link>
          <Link style={linkStyle} to="/betting">
            Place Bets on Teams
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
