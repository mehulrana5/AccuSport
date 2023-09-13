import React, { useContext } from 'react';
import AppContext from '../Context';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function CreateTeam() {
    const context = useContext(AppContext)
    const navigate=useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    async function handelSubmit(data){
        try {
            await context.createTeam(data);
            navigate("../myTeams")
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = (data) => {
        // console.log(data);
        handelSubmit(data);
    }

    function validateTeamName(value) {
        if (value.length < 4) return "Length of team name should be atleast 4 characters"
    }

    return (
        <div className='container-2'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Team Name</h3>
                <input
                    className='form-input'
                    {...register('team_name', {
                        required: true,
                        validate: validateTeamName
                    })}
                />
                {errors.team_name && <p style={{ color: "red" }}>{errors.team_name.message}</p>}
                <h5 style={{color:"#40a7f3"}}>By default you will be the team leader of this team</h5>
                <button type="submit" className='green-btn'>Create</button>
            </form>
        </div>
    );
}

export default CreateTeam;
