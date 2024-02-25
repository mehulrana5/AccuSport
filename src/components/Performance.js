import React, { useContext, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import AppContext from '../Context'

function Performance({ togglePerformanceModal, tournamentId, state }) {
    const context = useContext(AppContext)

    const [dataPoints, setDataPoints] = useState();
    const [teamId, setTeamData] = useState();
    const [playerData, setPlayerData] = useState();
    const [playerId, setPlayerId] = useState();
    const [next, setNext] = useState(false);
    const [sumbitted,setSubmitted]=useState(false);

    const { register, control, formState: { errors }, handleSubmit, setValue, } = useForm();

    const { fields: teamFields} = useFieldArray({
        name: 'dataPoints',
        control,
    });

    function onSubmit(data) {
        const check = window.confirm("Are you sure you wanna submit. Once sumbitted then this data can not be updated")
        if(!check){
            return
        }
        const updatedData = {};
        for (let i = 0; i < dataPoints.length; i++) {
            const record = data.records[i];
            if (record !== "") {
                const dataPoint = data.dataPoints[i];
                updatedData[dataPoint] = record;
            }
        }
        let newData={tournament_id:tournamentId,match_id:state.match._id,team_id:teamId,performance_metrics:updatedData}
        if(playerId){
            newData={...newData,player_id:playerId};
        }
        // console.log(newData);
        context.createPerformanceRecord(newData).then((res)=>{
            alert(res.error)
        });
    }

    function handelTeamData(teamId) {
        setTeamData(teamId)
        context.fetchPlayers(teamId, 'teamPlayersNameOnly').then((res) => {
            setPlayerData(res);
        })
    }

    function handelPlayerData(playerId) {
        setPlayerId(playerId)
    }

    function handelClear() {
        setPlayerData();
        setPlayerId();
        setTeamData();
    }

    function handelNext() {
        if (teamId) {
            const data = { player_id: playerId, team_id: teamId ,tournament_id:tournamentId,match_id:state.match._id}
            setNext(!next);
            context.fetchPerformanceRecord(data).then((res)=>{
                if(res[0]?.performance_metrics!==undefined){
                    setSubmitted(true);
                    const values = Object.values(res[0].performance_metrics);
                    setValue("records",values)
                }
                
            })
        }
    }

    useEffect(() => {
        if (tournamentId) {
            context.fetchDataPoints(tournamentId).then((res) => {
                setDataPoints(res.performance_metrics);
            })
        }
    }, [])

    useEffect(() => {
        if (dataPoints) {
            // console.log(dataPoints);
            setValue("dataPoints", dataPoints);
        }
    }, [dataPoints])

    useEffect(() => {
        // console.log(playerData);
    }, [playerData])

    return (
        <div
            style={{
                position: "fixed",
                left: "25%",
                top: "25%",
                backgroundColor: "#2d2d2d",
                padding: "30px",
                overflow: "auto",
                maxHeight: "400px",
                width: '50%'
            }}
        >
            <button className='red-btn' type='button' onClick={togglePerformanceModal}>Close</button>
            {
                next ?
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <button type="button" className="blue-btn" onClick={handelNext}>Back</button>
                            {
                                sumbitted?<></>:<button className='green-btn' type='submit' disabled={sumbitted}>Submit</button>

                            }
                            <div>
                                {teamFields.map((field, idx) => {
                                    return (
                                        <div key={field.id}>
                                            <input
                                                type="text"
                                                className="form-input"
                                                readOnly={true}
                                                style={{ margin: '5px 5px 0 0', width: '40%' }}
                                                {...register(`dataPoints[${idx}]`, {
                                                    required: true,
                                                })}
                                            />
                                            <input
                                                type="text"
                                                className="form-input"
                                                style={{ margin: '5px 5px 0 0', width: '40%' }}
                                                {...register(`records[${idx}]`, {
                                                })}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </form>
                    </>
                    :
                    <div>
                        <div>
                            {
                                teamId ?
                                    <>
                                        <h4>
                                            Team ID
                                        </h4>
                                        {teamId}
                                    </>
                                    : <></>
                            }
                        </div>
                        <div>
                            {
                                playerId ?
                                    <>
                                        <h4>
                                            Player ID
                                        </h4>
                                        {playerId}
                                    </>
                                    : <></>
                            }
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                left: '50%',
                                top: '20%',
                            }}
                        >
                            <div>
                                <button type="button" className='blue-btn' onClick={() => handelTeamData(state.teams.team1._id)}>{state.teams.team1.team_name}</button>
                                <button type="button" className='blue-btn' onClick={() => handelTeamData(state.teams.team2._id)}>{state.teams.team2.team_name}</button>
                            </div>
                            <div>
                                {
                                    playerData && playerData.map((player, idx) => (
                                        <button
                                            type="button"
                                            className="blue-btn"
                                            key={idx}
                                            onClick={() => handelPlayerData(player._id)}
                                        >
                                            {player.player_name}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                        <button type="button" className="red-btn" onClick={handelClear}>Clear</button>
                        <button type="button" className="green-btn" onClick={handelNext}>Next</button>
                    </div>
            }
        </div>
    )
}

export default Performance
