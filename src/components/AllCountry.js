import axios from 'axios';
import React, { useState, useEffect } from 'react';
import TeamData from './TeamData';
import { Link } from 'react-router-dom';

const AllCountry = () => {
    const [countries, setCountries] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchCountries = async () => {
            const options = {
                method: 'GET',
                url: 'https://www.thesportsdb.com/api/v1/json/3/all_countries.php?s=Soccer',
            };

            try {
                const response = await axios.request(options);
                setCountries(response.data.countries);  // assuming 'countries' field contains the data
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false); 
            }
        };

        fetchCountries(); 
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;  
    }

    if (error) {
        return <h2>Error: {error}</h2>; 
    }

    return (
        <div>
        <center>
        <h1>All Countries</h1>
            {countries.map((country) => (
                    <button style={{ width: '20%' }}>
                        <img
                            src={country.flag_url_32} 
                            alt={country.name}
                            style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        <h2>{country.name_en}</h2>
                    </button>
            ))}
        </center>
        </div>
    );
};

export default AllCountry;
