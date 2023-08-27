import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import '../css/MyDetails.css'
const MyDetails = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="details-container">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.Role}</p>
      </div>
    )
  );
};

export default MyDetails;