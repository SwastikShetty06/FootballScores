import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

const FootballScores = () => {
  const [teamName, setTeamName] = useState("Arsenal"); 
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      setError(null);
      try {
        const teamResponse = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${teamName}`
        );
        if (!teamResponse.ok) {
          throw new Error(`HTTP error! Status: ${teamResponse.status}`);
        }
        const teamData = await teamResponse.json();
        const team = teamData.teams[0]; 

        if (!team) {
          throw new Error("Team not found");
        }

        const teamId = team.idTeam;
        
        const eventsResponse = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`
        );
        if (!eventsResponse.ok) {
          throw new Error(`HTTP error! Status: ${eventsResponse.status}`);
        }
        const eventsData = await eventsResponse.json();
        setScores(eventsData.results);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamName]); 

  const handleTeamChange = (e) => {
    setTeamName(e.target.value);
  };

  return (
    <div className="fade-in">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8} className="text-center">
            <h1 className="page-title">🔍 Football Team Search</h1>

            {/* Enhanced search input */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="search-container"
            >
              <div className="search-icon">🔍</div>
              <input
                type="text"
                value={teamName}
                onChange={handleTeamChange}
                placeholder="Enter team name (e.g., Arsenal, Barcelona)"
                className="search-input-enhanced form-control"
              />
            </motion.div>
            
            {loading && <div className="loading-text">⚽ Loading team data...</div>}
            {error && <div className="error-text">❌ Error: {error}</div>}

            {!loading && !error && scores && scores.length > 0 && (
              <div>
                <h3 style={{ 
                  marginBottom: '30px', 
                  color: 'var(--soft-white)', 
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
                }}>Recent Matches for {teamName}</h3>
                <div className="match-results-container">
                {scores.map((event, index) => {
                  // Determine match result for the searched team
                  const getMatchResult = () => {
                    const homeScore = parseInt(event.intHomeScore);
                    const awayScore = parseInt(event.intAwayScore);
                    const isHomeTeam = event.strHomeTeam.toLowerCase().includes(teamName.toLowerCase());
                    
                    if (homeScore === awayScore) return 'draw';
                    if ((isHomeTeam && homeScore > awayScore) || (!isHomeTeam && awayScore > homeScore)) {
                      return 'win';
                    }
                    return 'loss';
                  };
                  
                  return (
                    <motion.div 
                      key={index} 
                      className={`match-container ${getMatchResult()}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                    <div className="match-date">📅 {new Date(event.dateEvent).toLocaleDateString('en-US', {
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</div>
                    
                    <div className="team-vs-container">
                      {/* Home team */}
                      <div className="team-info">
                        <img 
                          src={event.strHomeTeamBadge} 
                          alt={`${event.strHomeTeam} logo`}
                          className="team-logo"
                        />
                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{event.strHomeTeam}</span>
                      </div>
                      
                      <div className="vs-text">VS</div>
                      
                      <div className="team-info">
                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{event.strAwayTeam}</span>
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
                  );
                })}
                </div>
              </div>
            )}
            
            {!loading && !error && (!scores || scores.length === 0) && (
              <div className="cards">
                <p style={{ color: '#666', fontSize: '1.1rem' }}>No recent matches found for "{teamName}". Try searching for another team!</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FootballScores;
