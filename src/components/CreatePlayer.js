import React, { useContext, useState } from 'react';
import AppContext from '../Context';
import { useNavigate } from 'react-router-dom';

function CreatePlayer() {
    const context = useContext(AppContext);
    const navigate = useNavigate();

    const [cred, setCred] = useState({
        player_name: '',
        player_dob: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        context.createPlayer(cred);
        navigate('/')
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCred({
            ...cred,
            [name]: value
        });
    };

    return (
        <div className='container-1'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2 className="form-heading">Player Profile Form</h2>
                    <label className='form-label' htmlFor="playerName">Player Name</label>
                    <input
                        type="text"
                        id="playerName"
                        className='form-input'
                        name="player_name"
                        value={cred.player_name}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label className='form-label' htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        type='date'
                        id="dateOfBirth"
                        className='form-input'
                        name="player_dob"
                        value={cred.player_dob}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className='submit-button'>Submit</button>
            </form>
        </div>
    );
}

export default CreatePlayer;
