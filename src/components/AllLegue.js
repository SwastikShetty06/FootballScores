import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AllLeague = () => {
    const [leagues, setLeagues] = useState([]);
    const [filteredLeagues, setFilteredLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await axios.get('https://www.thesportsdb.com/api/v1/json/3/all_leagues.php');
                const allLeagues = response.data.leagues;

                const soccerLeagues = allLeagues
                    .filter(league => league.strSport === 'Soccer')
                    .slice(0, 20);

                setLeagues(soccerLeagues);
                setFilteredLeagues(soccerLeagues);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchLeagues();
    }, []);

    useEffect(() => {
        const results = leagues.filter(league =>
            league.strLeague.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLeagues(results);
    }, [searchTerm, leagues]);

    if (loading) {
        return (
            <div className="text-center">
                <div className="loading-spinner"></div>
                <p className="text-muted mt-3">Loading leagues...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-danger">
                <h3>Error loading leagues</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="text-center mb-5">
                <h1 className="page-title">🏆 Top Football Leagues</h1>

                <div className="search-wrapper">
                    <i className="fas fa-search search-icon">🔍</i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search leagues..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="cards-grid">
                {filteredLeagues.map((league, index) => (
                    <motion.div
                        key={league.idLeague}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link to={`/league/${league.strLeague}`} style={{ textDecoration: 'none' }}>
                            <div className="glass-card p-4 h-100 d-flex flex-column align-items-center text-center">
                                <div className="mb-3" style={{ fontSize: '3rem' }}>🏆</div>
                                <h3 className="text-white mb-2">{league.strLeague}</h3>
                                <span className="badge bg-primary bg-opacity-25 text-primary px-3 py-2 rounded-pill">
                                    {league.strLeagueAlternate || 'League'}
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AllLeague;
