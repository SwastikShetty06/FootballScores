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
        return <div className="loading-text">🌍 Loading countries...</div>;
    }

    if (error) {
        return <div className="error-text">❌ Error: {error}</div>;
    }

    return (
        <div className="fade-in">
            <div className="text-center">
                <h1 className="page-title">🌍 All Countries</h1>
                <div className="cards">
                    {countries.map((country, idx) => (
                        <div key={country.name_en} className="league-card-wrapper">
                            <div className="league-card" style={{ minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src={country.flag_url_32}
                                    alt={country.name_en}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                />
                                <h4 className="league-name" style={{ fontSize: '1.1rem', margin: 0 }}>{country.name_en}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllCountry;
