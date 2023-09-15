import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppContext from '../Context';

function CreateMatchPage() {
  const { handleSubmit, register, watch, getValues, setValue, formState: { errors } } = useForm();

  const [showMapModal, setShowMapModal] = useState(false);
  const [geoData, setGeoData] = useState([])

  const context = useContext(AppContext)

  const onSubmit = (data) => {
    // console.log(data);
    createMatch(data)
  };

  const openMapModal = () => {
    setShowMapModal(true);
  };

  const closeMapModal = () => {
    setShowMapModal(false);
  };

  const loc = watch("locationId")

  async function HandelGetGeoData() {
    try {
      let arr = [];
      const response = await fetch("https://www.scribblemaps.com/api/maps/FMrKcAggHH/geojson")
      const data = await response.json();
      data.features.forEach(e => {
        arr.push(e.properties.description.substring(3, 14))
      });
      setGeoData(arr)
    } catch (error) {
      console.log(error);
    }
  }

  async function createMatch(data) {
    const response = await context.createMatch(data);
    alert(response.data.error)
  }

  useEffect(() => {
    if (geoData.length === 0) {
      HandelGetGeoData()
    }
    // eslint-disable-next-line
  }, [])

  const toggleMapButton = showMapModal ? "Close map" : "Show venues on map";

  // Custom validation function

  function isValidObjectId(value) {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(value);
  }

  function isValidStartDateTime(value) {

    const curDate = new Date();
    const setDate = new Date(value);

    if (curDate >= setDate) {
      return "Match start date-time must be set in the future.";
    }
  }
  function isValidEndDateTime(value) {
    const startDate = new Date(getValues("matchStartDateTime"));
    const endDate = new Date(value);

    if (startDate >= endDate) {
      return "Match end date-time must be set in the after start date-time.";
    }
  }

  function isValidLocation(value) {
    if (!geoData.includes(value)) return "Invalid open location code"
  }

  return (
    <div className='container-3' style={{height:"60vh",width:""}}>
      <div className=''>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group' >
            <h3>Tournament Id</h3>
            <input
              type="text"
              id="tournamentId" 
              className='form-input'
              {...register('tournamentId', {
                required: true,
                validate: isValidObjectId, // Custom validation for MongoDB ObjectId
              })}
            />
            {errors.tournamentId && <p style={{ color: "red" }}>Invalid MongoDB ObjectId format.</p>}
          </div>
          <div className='form-group' >
            <h3>Team 1 Id</h3>
            <input
              type="text"
              id="team1"
              className='form-input'
              {...register('team1', {
                required: true,
                validate: isValidObjectId, // Custom validation for MongoDB ObjectId
              })}
            />
            {errors.team1 && <p style={{ color: "red" }}>Invalid MongoDB ObjectId format.</p>}
          </div>
          <div className='form-group' >
            <h3>Team 2 Id</h3>
            <input
              type="text"
              id="team2"
              className='form-input'
              {...register('team2', {
                required: true,
                validate: isValidObjectId, // Custom validation for MongoDB ObjectId
              })}
            />
            {errors.team2 && <p style={{ color: "red" }}>Invalid MongoDB ObjectId format.</p>}
          </div>
          <div className='form-group'>
            <h3>Enter venue location code</h3>
            <button type="button" className='blue-btn' onClick={showMapModal ? closeMapModal : openMapModal}>
              {toggleMapButton}
            </button>
            <input
              type="text"
              id="locationId"
              className='form-input'
              {...register('locationId', {
                required: true,
                validate: isValidLocation
              })}
              autoComplete='off'
            />
            {errors.locationId && <p style={{ color: "red" }}>{errors.locationId.message}</p>}
            {geoData &&
              geoData.filter(item => {
                const searchTerm = loc.toUpperCase();
                return searchTerm && item.startsWith(searchTerm) && searchTerm !== item;
              })
                .slice(0, 3)
                .map((data, idx) => (
                  <div onClick={() => setValue("locationId", data)} className="drop-down-row" key={idx}>
                    {data}
                  </div>
                ))}
          </div>
          <div className="form-group">
            <h3>Start Date and Time</h3>
            <input
              type="datetime-local"
              id="matchStartDateTime"
              className='form-input'
              {...register('matchStartDateTime', {
                required: true,
                validate: isValidStartDateTime
              })}
            />
            {errors.matchStartDateTime && <p style={{ color: "red" }}>{errors.matchStartDateTime.message}</p>}
          </div>
          <div className="form-group">
            <h3>End Date and Time</h3>
            <input
              type="datetime-local"
              id="matchEndDateTime"
              className='form-input'
              {...register('matchEndDateTime', {
                required: true,
                validate: isValidEndDateTime
              })}
            />
            {errors.matchEndDateTime && <p style={{ color: "red" }}>{errors.matchEndDateTime.message}</p>}
          </div>
          <div className='form-group' >
            <h3>Match Description</h3>
            <textarea
              id="matchDescription"
              cols="70"
              rows="3"
              className='form-input'
              {...register('matchDescription', {
                required: true,
                // validate: isValidObjectId,
              })}
            />
            {errors.matchDescription && <p style={{ color: "red" }}>Match Description is required.</p>}
          </div>
          <div>
            <button type="submit" className='blue-btn'>
              Submit
            </button>
          </div>
        </form>
      </div>
      {showMapModal && (
        <div>
          <iframe
            title='1'
            id='frame1'
            width="700"
            height="400"
            frameborder="0"
            src="https://widgets.scribblemaps.com/sm/?d&dv&cv&mt&z&ol&l&gc&af&sc&mc&dfe&lat=28.576343343&lng=77.392900622&vz=19&type=hybrid&ti&s&width=550&height=400&id=FMrKcAggHH"
            style={{ border: 0, maxWidth: "100%" }}
            allowFullScreen
            allow="geolocation"
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default CreateMatchPage;
