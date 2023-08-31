import React, { useContext } from "react";
import AppContext from "../Context";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const currentDate = new Date();
  
  const years = currentDate.getFullYear() - birthDate.getFullYear();
  const months = currentDate.getMonth() - birthDate.getMonth();
  
  if (months < 0 || (months === 0 && currentDate.getDate() < birthDate.getDate())) {
    return years - 1;
  } else {
    return years;
  }
};

const MyDetails = () => {
  const context = useContext(AppContext);

  return (
    <div className="container-2">
      <h2>My Profile (id:{context.playerInfo._id})</h2>
      <table className="details-table" style={{width:'30%',minWidth:"200px"}}>
        <tbody>
          <tr>
            <td className="details-label">Name</td>
            <td className="details-value">{context.playerInfo.player_name}</td>
          </tr>
          <tr>
            <td className="details-label">Age</td>
            <td className="details-value">{calculateAge(context.playerInfo.player_dob)} years</td>
          </tr>
          <tr>
            <td className="details-label">Team Ids</td>
            <td className="details-value">{context.playerInfo.team_ids.join(",")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyDetails;
