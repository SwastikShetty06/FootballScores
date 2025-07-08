import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

const TeamData = () => {
    const { teamName } = useParams();  
    const [scores, setScores] = useState([]);
    const [team, setTeam] = useState(null);  
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchTeamData = async () => {
            const teamResponse = await fetch(
                `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${teamName}`
            );
            const teamData = await teamResponse.json();

            // Check if the team exists
            if (teamData.teams && teamData.teams.length > 0) {
                const team = teamData.teams[0]; 
                setTeam(team); 

                // Fetch the last events
                const eventsResponse = await fetch(
                    `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team.idTeam}`
                );
                const eventsData = await eventsResponse.json();
                setScores(eventsData.results || []);  
            }

            setLoading(false);  
        };

        fetchTeamData();
    }, [teamName]);

    if (loading) {
        return <div className="loading-text">⚽ Loading team data...</div>;  
    }

    if (!team) {
        return (
            <div className="error-text">
                ❌ Team "{teamName}" not found. Please check the team name and try again.
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="text-center">
                <h1 className="page-title">👥 {teamName}</h1>
                
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} md={10} lg={8}>
                            <div>
                                <h3 style={{ 
                                    marginBottom: '30px', 
                                    color: 'var(--soft-white)', 
                                    fontSize: '1.8rem',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
                                }}>Recent Matches</h3>
                                <div className="match-results-container">
                                {scores && scores.length > 0 ? (
                                    scores.map((event, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="match-container"
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.5 }}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                        >
                                            <div className="match-date">
                                                📅 {new Date(event.dateEvent).toLocaleDateString('en-US', { 
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </div>
                                            
                                            <div className="team-vs-container">
                                                <div className="team-info">
                                                    <img 
                                                        src={event.strHomeTeamBadge} 
                                                        alt={`${event.strHomeTeam} logo`}
                                                        className="team-logo"
                                                    />
                                                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                                                        {event.strHomeTeam}
                                                    </span>
                                                </div>
                                                
                                                <div className="vs-text">VS</div>
                                                
                                                <div className="team-info">
                                                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                                                        {event.strAwayTeam}
                                                    </span>
                                                    <img
                                                        src={event.strAwayTeamBadge}
                                                        alt={`${event.strAwayTeam} logo`}
                                                        className="team-logo"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="match-score">
                                                ⚽ Final Score: {event.intHomeScore} - {event.intAwayScore}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div style={{ 
                                        color: 'var(--soft-white)', 
                                        fontSize: '1.2rem', 
                                        padding: '40px',
                                        textAlign: 'center',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
                                    }}>
                                        📋 No recent matches found for {teamName}
                                    </div>  
                                )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default TeamData;
