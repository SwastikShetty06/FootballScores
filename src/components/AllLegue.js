import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
        return <div className="loading-text">⚽ Loading leagues...</div>;  
    }

    if (error) {
        return <div className="error-text">❌ Error: {error}</div>; 
    }

    return (
        <div className="fade-in">
            <div className="text-center">
                <h1 className="page-title">🏆 Top Football Leagues</h1>
                <div className="cards">
                    {leagues.map((league, index) => (
                        <motion.div 
                          key={league.idLeague} 
                          className="league-card-wrapper"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          whileHover={{ 
                            scale: 1.05,
                            rotateY: 5,
                            transition: { duration: 0.3 }
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                            <Link to={`/league/${league.strLeague}`} style={{ textDecoration: 'none' }}>
                                <div 
                                    className="league-card" 
                                    data-league={league.strLeague}
                                    onClick={() => {
                                        // Add click pulse feedback
                                        const card = document.querySelector(`[data-league="${league.strLeague}"]`);
                                        card.style.animation = 'clickPulse 0.3s ease';
                                        setTimeout(() => {
                                            card.style.animation = '';
                                        }, 300);
                                    }}
                                >
                                    <div className="league-card-content">
                                        <div className="league-icon">🏆</div>
                                        <h4 className="league-name">{league.strLeague}</h4>
                                        <div className="league-badge">⚽</div>
                                    </div>
                                    <div className="league-card-glow"></div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllLeague;
