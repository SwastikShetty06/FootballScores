import axios from 'axios';
import React, { useState, useEffect } from 'react';
import TeamData from './TeamData';
import { Link, useParams } from 'react-router-dom';

const AllTeam = () => {
    const [teams, setTeams] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const { leagueName } = useParams();

    useEffect(() => {
        const fetchTeams = async () => {
        const options = {
            method: 'GET',
            url: 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php',
            params: { l: leagueName },
        };

        try {
            const response = await axios.request(options);
            setTeams(response.data.teams);  
            setLoading(false);
        } catch (error) {
            setError();
            setLoading(false); 
        }
        };

        fetchTeams(); 
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
        <h1>{leagueName}</h1>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {teams.map((team) => (
            <Link to={`/team/${team.strTeam}`} key={team.idTeam} style={{ textDecoration: 'none' }}>
                <button style={{ width: '35%' }}>
                    <li key={team.idTeam} style={{ marginBottom: '10px' }}>
                        <TeamData 
                            teamName={team.strTeam}
                        />
                        <img
                        src={team.strBadge}
                        alt={team.strTeam}
                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        <h4>{team.strTeam}</h4>
                    </li>
                </button>
            </Link>
            ))}
        </ul>
        </center>
        </div>
    );
};

export default AllTeam;
