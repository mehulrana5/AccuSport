import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../Context';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';

function CreatePlayer() {
    const context = useContext(AppContext);

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm();

    const { fields, remove } = useFieldArray({
        name: "team_ids",
        control
    });

    const [data, setData] = useState();

    const onSubmit = (data) => {
        context.createPlayer(data).then(() => { navigate('/') })
    }

    function isValidName(value) {
        if (value.length < 3) return "name should be more than 2 characters"
    }

    function isValidplayer_dob(value) {
        const cur = new Date();
        const player_dob = new Date(value);
        if (cur < player_dob) return "invalid date of birth"
    }

    // useEffect(()=>{
    //     if(playerId){

    //     }
    // },[])

    let { operation,playerId } = useParams();

    useEffect(() => {
        console.log(playerId);
        // console.log("running");
        if (playerId) {
            context.fetchPlayers(playerId, "id").then((res) => {
                console.log(res);
                setData(res);
            })
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (data) {
            setValue("player_name", data.player_name)
            setValue("player_id", data._id)
            const date = new Date(data.player_dob);
            const formattedDate = date.toLocaleDateString("en-CA"); // Adjust the locale as needed
            setValue("player_dob", formattedDate);
            setValue("team_ids", data.team_ids)
        }
        // eslint-disable-next-line
    }, [data])

    return (
        <div className='container-2'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {
                        data ? <></>
                            : <h2 className="form-heading">Create Player Profile</h2>
                    }
                    <h3>Player Name</h3>
                    <input
                        type="text"
                        className='form-input'
                        readOnly={playerId}
                        {...register('player_name', {
                            required: true,
                            validate: isValidName
                        })}
                    />
                    {errors.player_name && <p style={{ color: "red" }}>{errors.player_name.message}</p>}
                    {
                        data ?
                            <div>
                                <h3>ID</h3>
                                <input
                                    type='string'
                                    className='form-input'
                                    readOnly={playerId}
                                    {...register('player_id', {
                                        required: true,
                                    })}
                                />
                            </div>
                            : <></>
                    }
                    <h3>Date of Birth</h3>
                    <input
                        type='date'
                        className='form-input'
                        readOnly={playerId}
                        {...register('player_dob', {
                            required: true,
                            validate: isValidplayer_dob
                        })}
                    />
                    {errors.player_dob && <p style={{ color: "red" }}>{errors.player_dob.message}</p>}
                    {
                        !playerId ? <></>
                            : <h3>Teams</h3>
                    }
                    <div>
                        {fields.map((field, idx) => {
                            return (
                                <div key={field.id}>
                                    <input
                                        type="text"
                                        className='form-input'
                                        style={{ margin: "5px 5px 0 0", width: "40%" }}
                                        readOnly={1}
                                        {...register(`team_ids[${idx}]`, {
                                            required: true,
                                        })}

                                    />
                                    {
                                        !data ? <></>
                                            : (idx >= 0 && (
                                                <>
                                                    <button type="button" className='green-btn' onClick={() => navigate(`../teams/view/${data.team_ids[idx]}`)}>View</button>
                                                    <button type='button' className='red-btn' onClick={() => remove(idx)}>Leave</button>
                                                </>
                                            ))
                                    }
                                    {errors.team_ids && errors.team_ids[idx] && (
                                        <p style={{ color: "red" }}>Invalid Object ID format.</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
                {
                    data ? <>
                        {/* <button className='blue-btn' type="button">Update Team</button> */}
                        <button className='blue-btn' type="button" onClick={() => navigate("../teams/myTeams")}>My Teams</button>
                        <button className='green-btn' type="button" onClick={() => navigate("../teams/myTeams")}>Join team</button>
                        <button className='green-btn' type="button" onClick={() => navigate("../teams/createTeam")}>Create team</button>
                    </>
                        : <button type="submit" className='blue-btn'>Submit</button>
                }
            </form>
        </div>
    );
}

export default CreatePlayer;
