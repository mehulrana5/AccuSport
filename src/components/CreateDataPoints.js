import React, { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import AppContext from '../Context';

function CreateDataPoints({ toggleDataPointsModal, tournamentId }) {

    const context = useContext(AppContext);

    const [dataPoints, setDataPoints] = useState();

    const { register, control, formState: { errors }, handleSubmit, setValue, watch } = useForm();

    const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({
        name: 'performance_metrics',
        control,
    });

    const onSubmit = (data) => {
        const updatedData = {
            tournament_id: tournamentId,
            performance_metrics: data.performance_metrics,
        }
        context.createDataPoints(updatedData).then((res) => {
            alert(res.error)
        });
    }

    const handelUpdate = async () => {
        const newPerformanceMetrics = watch('performance_metrics')
        const updatedData = {
            tournament_id: tournamentId,
            performance_metrics: newPerformanceMetrics,
        }
        context.updateDataPoints(updatedData).then((res) => {
            alert(res.error)
        });
    }

    useEffect(() => {
        if (tournamentId) {
            context.fetchDataPoints(tournamentId).then((res) => {
                setDataPoints(res?.performance_metrics)
            })
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (dataPoints) {
            setValue("performance_metrics", dataPoints);
        }
        // eslint-disable-next-line
    }, [dataPoints])

    return (
        <div
            style={{
                position: "fixed",
                left: "30%",
                top: "25%",
                backgroundColor: "#2d2d2d",
                padding: "30px",
                overflow: "auto",
                maxHeight: "400px"
            }}
        >
            <h3>Performance Matrices</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                {
                    dataPoints ? <button className='blue-btn' type="button" onClick={handelUpdate}>Update</button>
                        : <button className='blue-btn' type="submit">Submit</button>
                }
                <button type="button" className='red-btn' onClick={toggleDataPointsModal}>Close</button>
                <div>
                    <h4>Data Points</h4>
                    <div>
                        {teamFields.map((field, idx) => {
                            return (
                                <div key={field.id}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ margin: '5px 5px 0 0', width: '40%' }}
                                        {...register(`performance_metrics[${idx}]`, {
                                            required: true,
                                        })}
                                    />
                                    <button className="red-btn" onClick={() => removeTeam(idx)}>Remove</button>
                                    {errors.performance_metrics && errors.performance_metrics[idx] && (
                                        <p style={{ color: 'red' }}>Invalid Object ID format for Teams.</p>
                                    )}
                                </div>
                            );
                        })}
                        <button className="green-btn" type="button" onClick={() => appendTeam('')}>Add</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateDataPoints;
