import React, { useContext, useEffect, useState} from 'react'
import AppContext from '../Context'
import { useNavigate } from 'react-router-dom'

function MyTeams() {

    const context=useContext(AppContext)
    const navigate=useNavigate();
    
    const [teams,setTeams]=useState(false)

    useEffect(()=>{
      if(context.userInfo._id){
        context.fetchTeam(context.userInfo._id,"user").then((data)=>{setTeams(data)})
      }
      // eslint-disable-next-line
    },[])

    async function handelDelete(e){
      try {
        const flag=window.confirm(`Do you want to delete ${e.team_name}`)
        if(flag){
          context.deleteTeam(e._id).then((data)=>{
            alert(data.error)
            navigate('../createTeam')
          })
        } 
      } catch (error) {
        console.log(error);
      }
    }

    return (
    <div>
      <h1>My Teams</h1>
      {
        teams && teams.map((e,idx)=>(
            <div className="card" key={idx}>
                <div>
                    {e.team_name}
                </div>
                <div>
                    <button type="button" className='green-btn' onClick={()=>navigate(`../view/${e._id}`)}>View</button>
                    <button type="button" className='blue-btn' onClick={()=>navigate(`../update/${e._id}`)}>Update</button>
                    <button type="button" className='red-btn' onClick={()=>handelDelete(e)}>Delete</button> 
                </div>
            </div>
        ))
      }
    </div>
  )
}

export default MyTeams
