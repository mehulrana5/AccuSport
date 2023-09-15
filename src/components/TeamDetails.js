import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../Context';
import { useFieldArray, useForm } from 'react-hook-form';

function TeamInfo() {
    const { operation, teamId } = useParams();

    const context = useContext(AppContext);

    const [data, setData] = useState()
    const [players, setPlayers] = useState();

    const isView = operation === 'view'

    const { register, handleSubmit, control, formState: { errors }, setValue} = useForm();

    const { fields, append, remove } = useFieldArray({
        name: "team_players",
        control
    });

    async function fetchTeam() {
        try {
            const res = await context.fetchTeam(teamId,"id")
            setData(res);
            const data=await context.fetchPlayers(teamId,"team");
            setPlayers(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchTeam();
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (data) {
            setValue("team_id", data._id)
            setValue("team_name", data.team_name)
        }
        // eslint-disable-next-line
    }, [data])
    
    useEffect(()=>{
        if(players){
            setValue("team_players", data.team_players_ids)
        }
        // eslint-disable-next-line
    },[players])

    const onSubmit = (data) => {
        console.log(data);
    }

    const validateObjectId = (value) => {
        return /^[0-9a-fA-F]{24}$/.test(value);
    };

    return (
        <div className="container-2" style={{ padding: "5px" }}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <h3>ID</h3>
                <input
                    type="text"
                    className='form-input'
                    readOnly={1}
                    {
                    ...register("team_id")
                    }
                />
                <h3>Name</h3>
                <input
                    type="text"
                    className='form-input'
                    readOnly={1}
                    {
                    ...register("team_name")
                    }
                />
                <h2>Team Players</h2>
                <div>
                    {fields.map((field, idx) => {
                        return (
                            <div key={field.id}>
                                {
                                    isView?
                                    <h3>{players[idx].player_name}</h3>
                                    :<></>
                                }
                                <input
                                    type="text"
                                    className='form-input'
                                    style={{ margin: "5px 5px 0 0", width: "40%" }}
                                    readOnly={isView}
                                    {...register(`team_players[${idx}]`, {
                                        required: true,
                                        validate: validateObjectId, // Custom validation for MongoDB-like ObjectID
                                    })}

                                />
                                {
                                    isView ? <></>
                                        : (idx >= 0 && (
                                            <button className='red-btn' onClick={() => remove(idx)}>Remove</button>
                                        ))
                                }
                                {errors.team_players && errors.team_players[idx] && (
                                    <p style={{ color: "red" }}>Invalid Object ID format.</p>
                                )}
                            </div>
                        )
                    })}
                    {
                        isView ? <></>
                            : <button className='green-btn' type="button" onClick={() => append("")}>Add</button>
                    }
                </div>
                {
                    isView ? <></>
                        : <button className='blue-btn' type="submit">Update</button>
                }
            </form>
        </div>
    );
}

export default TeamInfo;
