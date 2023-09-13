import React, { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import AppContext from '../Context';
import { useNavigate, useParams } from 'react-router-dom';

function CreateTournamentPage() {

    const context = useContext(AppContext)

    const { operation, tournamentId } = useParams();

    const [data, setData] = useState();

    const navigate = useNavigate();

    const startDate = data ? new Date(data.start_date_time) : null;
    const formattedStartDate = startDate ? startDate.toISOString().slice(0, 16) : undefined;
    const readOnly = (operation === "view" || operation === "update");
    const viewOnly = operation === "view"
    const { register, handleSubmit, control, formState: { errors }, setValue, getValues } = useForm();
    let matchAdmins = data ? data.match_admins : null; 
    const { fields, append, remove } = useFieldArray({
        name: "match_admins",
        control
    });

    useEffect(() => {
        setData()
    }, [operation])

    useEffect(() => {
        if (tournamentId) {
            async function getData() {
                const res = await context.fetchTournament(tournamentId,"id");
                setData(res);
            }
            getData();
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setValue("tournament_name", data ? data.tournament_name : undefined)
        setValue("sport_type", data ? data.sport_type : undefined)
        setValue("start_date_time", data ? formattedStartDate : undefined)
        setValue("description", data ? data.description : undefined)
        setValue("match_admins", data ? matchAdmins : [])
        // eslint-disable-next-line
    }, [data])

    const onSubmit = (data) => {
        context.createTournament(data).then(()=>{navigate("../myTournaments")});
    }

    // Custom validation function for MongoDB-like ObjectID
    const validateObjectId = (value) => {
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        return objectIdPattern.test(value);
    };

    async function handelUpdateTournament() {
        try {
            const flag = window.confirm("Do you want to update these changes")
            if (flag) {
                const updatedData = {
                    ...data,
                    start_date_time: getValues("start_date_time"),
                    description: getValues("description"),
                    match_admins: getValues("match_admins"),
                };

                setData(updatedData);
                await context.updateTournament(updatedData);
                alert("updated")
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function handelEndTournament() {
        try {
            const flag = window.confirm("Do you want to end this tournament?")
            if (flag) {
                const curDateTime = new Date();
                const start = new Date(data.start_date_time)
                if (start > curDateTime) {
                    return alert(`Cannot End tournament before start date time\nToday:\t${curDateTime.toLocaleString()}\nStart:\t${start.toLocaleString()}`)
                }
                console.log("running end");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container-2' style={{height:"70vh"}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {
                    data?
                    <>
                        <h3>ID</h3>
                        <input
                            className='form-input'
                            readOnly={readOnly}
                            defaultValue={data ? data._id : undefined}
                        />
                    </>
                    :<></>
                }
                <h3>Name</h3>
                <input
                    className='form-input'
                    readOnly={readOnly}
                    defaultValue={data ? data.tournament_name : undefined}
                    {...register('tournament_name', {
                        required: true,
                        minLength: 4, // Minimum length of 4 characters
                    })}
                />
                {errors.tournament_name && errors.tournament_name.type === "required" && (
                    <p style={{ color: "red" }}>Please enter tournament name.</p>
                )}
                {errors.tournament_name && errors.tournament_name.type === "minLength" && (
                    <p style={{ color: "red" }}>Tournament name should be at least 4 characters.</p>
                )}
                <h3>Sport Type</h3>
                <select disabled={readOnly} className='form-input' {...register('sport_type', { required: true })}>
                    <option value="Badminton">Badminton</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Football">Football</option>
                    <option value="Hokey">Hokey</option>
                </select>
                <h3>Start Date and Time</h3>
                <input
                    className='form-input'
                    type="datetime-local"
                    defaultValue={formattedStartDate}
                    readOnly={viewOnly}
                    {...register('start_date_time', {
                        required: true,
                        min: new Date().toISOString().slice(0, 16), // Minimum value is the current date-time
                    })}
                />
                {errors.start_date_time && errors.start_date_time.type === "required" && (
                    <p style={{ color: "red" }}>Start Date-Time is required.</p>
                )}
                {errors.start_date_time && errors.start_date_time.type === "min" && (
                    <p style={{ color: "red" }}>Start Date-Time should not be before the current date.</p>
                )}
                <h3>Description</h3>
                <textarea
                    cols="40"
                    rows="4"
                    className='form-input'
                    defaultValue={data ? data.description : ""}
                    disabled={viewOnly}
                    {...register('description', { required: true })}
                />
                {errors.description && <p style={{ color: "red" }}>Please enter description.</p>}
                <h3>Match Admins</h3>
                {
                    viewOnly ? <></>
                        : <h5 style={{ color: "#2196f3" }}>In this tournament, you will be one of the match admin by default</h5>
                }
                <div>
                    {fields.map((field, idx) => {
                        return (
                            <div key={field.id}>
                                <input
                                    type="text"
                                    className='form-input'
                                    style={{ margin: "5px 5px 0 0", width: "40%" }}
                                    readOnly={viewOnly}
                                    {...register(`match_admins[${idx}]`, {
                                        required: true,
                                        validate: validateObjectId, // Custom validation for MongoDB-like ObjectID
                                    })}

                                />
                                {
                                    viewOnly ? <></>
                                        : (idx >= 0 && (
                                            <button className='red-btn' onClick={() => remove(idx)}>Remove</button>
                                        ))
                                }
                                {errors.match_admins && errors.match_admins[idx] && (
                                    <p style={{ color: "red" }}>Invalid Object ID format.</p>
                                )}
                            </div>
                        )
                    })}
                    {
                        viewOnly ? <></>
                            : <button className='green-btn' type="button" onClick={() => append("")}>Add</button>
                    }
                </div>
                {
                    operation === "update" ? (
                        <div>
                            <button type='button' onClick={handelUpdateTournament} className='blue-btn'>Update</button>
                            <button type='button' onClick={handelEndTournament} className='red-btn'>End Tournament</button>
                        </div>
                    )
                        : operation === "view" ? (<></>) : (<input className='blue-btn' type="submit" value={"Create"} />)
                }
            </form>
        </div>
    )
}

export default CreateTournamentPage;
