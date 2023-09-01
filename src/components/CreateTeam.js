import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../Context';

function CreateTeam() {
    const [team, setTeam] = useState({
        team_name: ''
    });

    const [totalTeams, setTotalTeams] = useState(0);

    const context = useContext(AppContext);

    const [myTeams, setMyTeams] = useState([{
        team_name: '',
        _id: ""
    }]);

    useEffect(() => {
        setMyTeams(context.myTeams)
        setTotalTeams(context.myTeams.length);
    }, [context.myTeams])

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setTeam(({ ...team, [id]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        context.createTeam(team);
        context.fetchMyTeams();
        setTeam({
            team_name: ''
        })
    };

    function handelDeleteTeam(tid, tname) {
        const check = window.confirm("you want to delete this team:" + tname);
        if (check) {
            context.deleteMyTeam(tid);
        }
    }


    

    function handelUpdateTeam(tid){

    }

    function handelShowTeam(tid){

    }
    

    return (
        <div className='container-1'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2 className='form-heading'>Create Team Form</h2>
                    <label className='form-label' htmlFor="team_name">Enter Team Name</label>
                    <input
                        type="text"
                        id="team_name"
                        className='form-input'
                        value={team.team_name}
                        onChange={handleInputChange}
                        style={{ width: "30%" }}
                    />
                </div>
                <button className='green-btn' type="submit">Create Team</button>
            </form>
            <h2>My Teams</h2>
            {
                totalTeams > 0 ?
                    <div className="container-3">
                        <div className="container-2">
                            {myTeams && myTeams.map((myTeam, idx) => (
                                <div key={idx} className='card'>
                                    <div><h3>{myTeam.team_name}</h3></div>
                                    <div>
                                        <button className='blue-btn' onClick={() => handelUpdateTeam(myTeam._id)}>Update Team</button>
                                        <button className='blue-btn' onClick={() => handelShowTeam(myTeam._id)}>Show Team</button>
                                        {/* <button className='green-btn' onClick={() => handelAddPlayer(myTeam._id)}>Add Player</button> */}
                                        {/* <button className='red-btn' onClick={() => handelRemovePlayer(myTeam._id)}>Remove Player</button> */}
                                        <button className='red-btn' onClick={() => handelDeleteTeam(myTeam._id, myTeam.team_name)}>Delete Team</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    : <>no teams made</>
            }
        </div>
    );
}

export default CreateTeam;
