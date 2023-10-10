import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppContext from '../Context';

function PlayersPage() {
    const context=useContext(AppContext)

    const [guest,setGuest]=useState(false);
    const [player,setPlayer] =useState(false);

    useEffect(()=>{
        setGuest(context.userInfo.user_role.includes("guest"));
        setPlayer(context.userInfo.user_role.includes("player"));
    },[context.userInfo,context.playerInfo])
    
    const navigate = useNavigate();
    
    const handelSearch = (e) => {
        e.preventDefault();
        const val=document.querySelector("#playerInput").value;
        document.querySelector("#playerInput").value="";
        if(val.length>3){
            const isObjId=/^[0-9a-fA-F]{24}$/.test(val)
            navigate(`.`)
            if(isObjId){
                navigate(`./view/${val}`)
            }
            else{
                context.fetchPlayers(val,"name").then((data)=>{
                    navigate(`./view/${data._id}`)
                })
            }
            console.log("running search");
        }
        else{
            alert("Input size should be more than 3 characters")
        }
    };
    return (
        <div className="container-1">
            <div className="container-2">
                <form>
                    <input type="text" className='form-input' id='playerInput'/>
                    <button type="submit" className='blue-btn' onClick={handelSearch}>Search</button>
                </form>
                <div>
                    {
                        player?<div>
                            <button type="button" className='green-btn' onClick={()=>navigate(`../player/${context.playerInfo._id}/view`)}>My Profile</button>
                        </div>
                        :
                        <div>
                            <button type="button" className='green-btn' onClick={()=>navigate(guest?"../createPlayer":"../login")}>Create Player</button>
                        </div>
                        
                    }
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default PlayersPage;