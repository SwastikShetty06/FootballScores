import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    }, [leagueName]);

    if (loading) {
        return <div className="loading-text">⚽ Loading teams...</div>;  
    }

    if (error) {
        return <div className="error-text">❌ Error loading teams</div>; 
    }

    return (
        <div className="fade-in">
            <div className="text-center">
                <h1 className="page-title">🏟️ {leagueName}</h1>
                <div className="cards">
                    {teams && teams.map((team, index) => (
                        <motion.div 
                            key={team.idTeam} 
                            className="team-card-wrapper"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.3 }
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to={`/team/${team.strTeam}`} style={{ textDecoration: 'none' }}>
                                <div className="team-card">
                                    <div className="team-card-content">
                                        <img
                                            src={team.strBadge}
                                            alt={team.strTeam}
                                            className="team-logo"
                                        />
                                        <h4 className="team-name">{team.strTeam}</h4>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllTeam;
