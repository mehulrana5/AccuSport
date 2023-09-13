import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppContext from '../Context';

const TournamentsPage = () => {

  const navigate=useNavigate();
  const context=useContext(AppContext)

  const [isPlayer,setIsPlayer]=useState(false);

  useEffect(()=>{
    setIsPlayer(context.userInfo.user_role.includes("player"))
  },[context.userInfo.user_role])

  function handelBtn(path){
    navigate(`${path}`)
  }
  async function handelSearch(){
    const query=document.querySelector("#search_1").value;
    document.querySelector("#search_1").value=''
    try {
      const res=await context.fetchTournament(query,"name");
      const data=res[0]
      navigate(`./view/${data._id}`)  
    } catch (error) {
      console.log(error);
    }
    
  }
  return (
    <div className="container-1">
      <div>
        <input id='search_1' className='form-input' type="text" />
        <button onClick={handelSearch} className='blue-btn'>Search</button>
      </div>
      <div className="tournament-buttons">
        <button className="blue-btn" onClick={()=>handelBtn('/tournaments/ongoing')}>Ongoing</button>
        <button className="blue-btn" onClick={()=>handelBtn('/tournaments/upcoming')}>Upcoming</button>
        <button className="blue-btn" onClick={()=>handelBtn('/tournaments/old')}>Old</button>
        <button className='blue-btn' onClick={()=>handelBtn(isPlayer?'./myTournaments':'../login')}>My tournaments</button>
        <button className='green-btn' onClick={()=>handelBtn(isPlayer?'./createTournament':'../login')}>Create</button>
      </div>
      <div className="tournament-container">
        <Outlet />
      </div>
    </div>
  );
};

export default TournamentsPage;
