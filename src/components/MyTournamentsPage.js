import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../Context';
import { useNavigate } from 'react-router-dom';

function MyTournamentsPage() {
    const context = useContext(AppContext);
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();

    useEffect(() => {
        // console.log(tournaments);
    }, [tournaments]);

    function handelBtn(operation,tid){
        navigate(`../${operation}/${tid}`)    
    }
    async function handelDelete(tn,tid){
        try {
            const flag=window.confirm(`Do you want to permanantly delete ${tn} tournament`);
            if(flag){
                const res=await context.deleteTournament(tid);
                alert(res.error);
                getTournaments();
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function getTournaments() {
        try {
            const data = await context.fetchTournament(context.userInfo._id,"org");
            setTournaments(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            // Handle the error gracefully, e.g., display an error message to the user.
        }
    }

    useEffect(() => {
        getTournaments();
        // eslint-disable-next-line
    }, []);
    return (
        <div className=''>
            <h1>My Tournaments</h1>
            {loading ? (
                <p>Loading...</p> // You can replace this with a spinner or loading animation.
            ) : (
                <div className="container-2">
                    {tournaments && tournaments.map((t, idx) => (
                        <div className="card" key={idx}>
                            <div>
                                <h3>{t.tournament_name}</h3>
                            </div>
                            <div>
                                <button className='green-btn' onClick={()=>handelBtn("view",t._id)}>View</button>
                                <button className='blue-btn' onClick={()=>handelBtn("update",t._id)}>Update</button>
                                <button className='red-btn' onClick={()=>handelDelete(t.tournament_name,t._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyTournamentsPage;
