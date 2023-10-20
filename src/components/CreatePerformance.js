import React, { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import AppContext from '../Context';

function CreatePerformance({togglePerformanceModal,tournamentId}) {

    const context=useContext(AppContext);

    const [dataPoints,setDataPoints]=useState();

    const { register, control, formState: { errors }, handleSubmit ,setValue,watch} = useForm();

    const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({
        name: 'team_performance_mat',
        control,
    });

    const { fields: playerFields, append: appendPlayer, remove: removePlayer } = useFieldArray({
        name: 'player_performance_mat',
        control,
    });

    
    const onSubmit = (data) => {
        const updatedData={
            tournament_id:tournamentId,
            team_metrics:data.team_performance_mat,
            player_metrics:data.player_performance_mat,
        }
        context.createDataPoints(updatedData).then((res)=>{
            alert(res.error)
        });
    }
    
    const handelUpdate=async()=>{
        console.log("running");
        const newPlayerDataPoints=watch('player_performance_mat')
        const newTeamDataPoints=watch('team_performance_mat')
        const updatedData={
            tournament_id:tournamentId,
            team_metrics:newTeamDataPoints,
            player_metrics:newPlayerDataPoints,
        }
        context.updateDataPoints(updatedData).then((res)=>{
            alert(res.error)
        });
    }

    useEffect(()=>{
        if(tournamentId && !dataPoints){
            context.fetchDataPoints(tournamentId).then((res)=>{
                setDataPoints([res.player_metrics,res.team_metrics])
            })
        }
        // eslint-disable-next-line
    },[])

    useEffect(()=>{
        if(dataPoints){
            setValue("player_performance_mat",dataPoints[0]);
            setValue("team_performance_mat",dataPoints[1]);
        }
        // eslint-disable-next-line
    },[dataPoints])

    return ( 
        <div
        style={{
            position:"fixed",
            left:"30%",
            top:"25%",
            backgroundColor:"#2d2d2d",
            padding:"30px",
            overflow:"auto",
            maxHeight:"400px"
        }}
        >
            <h3>Performance Matrices</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                {
                    dataPoints?<button className='blue-btn' type="button" onClick={handelUpdate}>Update</button>
                    :<button className='blue-btn' type="submit">Submit</button>
                }
                <button type="button" className='red-btn' onClick={togglePerformanceModal}>Close</button>
                <div>
                    <h4>Teams</h4>
                    <div>
                        {teamFields.map((field, idx) => {
                            return (
                                <div key={field.id}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ margin: '5px 5px 0 0', width: '40%' }}
                                        {...register(`team_performance_mat[${idx}]`, {
                                            required: true,
                                        })}
                                    />
                                    <button className="red-btn" onClick={() => removeTeam(idx)}>Remove</button>
                                    {errors.team_performance_mat && errors.team_performance_mat[idx] && (
                                        <p style={{ color: 'red' }}>Invalid Object ID format for Teams.</p>
                                    )}
                                </div>
                            );
                        })}
                        <button className="green-btn" type="button" onClick={() => appendTeam('')}>Add</button>
                    </div>
                </div>
                <div>
                    <h4>Players</h4>
                    <div>
                        {playerFields.map((field, idx) => {
                            return (
                                <div key={field.id}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ margin: '5px 5px 0 0', width: '40%' }}
                                        {...register(`player_performance_mat[${idx}]`, {
                                            required: true,
                                        })}
                                    />
                                    <button className="red-btn" onClick={() => removePlayer(idx)}>Remove</button>
                                    {errors.player_performance_mat && errors.player_performance_mat[idx] && (
                                        <p style={{ color: 'red' }}>Invalid Object ID format for Players.</p>
                                    )}
                                </div>
                            );
                        })}
                        <button className="green-btn" type="button" onClick={() => appendPlayer('')}>Add</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreatePerformance;
