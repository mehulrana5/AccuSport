import React, { useContext } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import AppContext from '../Context';

function CreateTournamentPage() {
    
    const context=useContext(AppContext)

    const { register, handleSubmit, control, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        // console.log(data);
        context.createTournament(data);
    }

    const { fields, append, remove } = useFieldArray({
        name: "match_admins",
        control
    });

    // Custom validation function for MongoDB-like ObjectID
    const validateObjectId = (value) => {
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        return objectIdPattern.test(value);
    };

    return (
        <div>
            <form className='form-group' onSubmit={handleSubmit(onSubmit)}>
                <h3>Tournament Name</h3>
                <input
                    className='form-input'
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
                <select className='form-input' {...register('sport_type', { required: true })}>
                    <option value="badminton">Badminton</option>
                    <option value="cricket">Cricket</option>
                    <option value="football">Football</option>
                    <option value="hokey">Hokey</option>
                </select>
                <h3>Tournament Start Date and Time</h3>
                <input
                    className='form-input'
                    type="datetime-local"
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

                <h3>Tournament Description</h3>
                <textarea
                    cols="30"
                    rows="10"
                    className='form-input'
                    {...register('description', { required: true })}
                />
                {errors.description && <p style={{ color: "red" }}>Please enter description.</p>}

                <h3>Match Admins</h3>
                <h5 style={{ color: "#2196f3" }}>In this tournament, you will be the match admin by default</h5>
                <div>
                    {fields.map((field, idx) => {
                        return (
                            <div key={field.id}>
                                <input
                                    type="text"
                                    className='form-input'
                                    style={{ marginRight: "5px" }}
                                    {...register(`match_admins[${idx}]`, {
                                        required: true,
                                        validate: validateObjectId, // Custom validation for MongoDB-like ObjectID
                                    })}
                                />
                                {idx >= 0 && (
                                    <button className='red-btn' onClick={() => remove(idx)}>Remove</button>
                                )}
                                {errors.match_admins && errors.match_admins[idx] && (
                                    <p style={{ color: "red" }}>Invalid Object ID format.</p>
                                )}
                            </div>
                        )
                    })}
                    <button className='green-btn' type="button" onClick={() => append("")}>Add</button>
                </div>

                <input className='blue-btn' type="submit" />
            </form>
        </div>
    )
}

export default CreateTournamentPage;
