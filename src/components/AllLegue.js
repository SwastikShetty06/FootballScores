import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AllLeague = () => {
    const [leagues, setLeagues] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await axios.get('https://www.thesportsdb.com/api/v1/json/3/all_leagues.php');
                const allLeagues = response.data.leagues;

                const soccerLeagues = allLeagues
                    .filter(league => league.strSport === 'Soccer')
                    .slice(0, 20);
                
                setLeagues(soccerLeagues);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false); 
            }
        };

        fetchLeagues(); 
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
                <h1>Top Soccer Leagues</h1>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {leagues.map((league) => (
                        <li key={league.idLeague} style={{ marginBottom: '20px' }}>
                            <Link to={`/league/${league.strLeague}`} style={{ textDecoration: 'none' }}>
                                <button style={{ width: '40%' }}>
                                    <h2>{league.strLeague}</h2>
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </center>
        </div>
    );
};

export default AllLeague;
