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

        if (!teamData.teams || teamData.teams.length === 0) {
          throw new Error("Team not found");
        }

        const team = teamData.teams[0];
        const teamId = team.idTeam;

        const eventsResponse = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`
        );
        if (!eventsResponse.ok) {
          throw new Error(`HTTP error! Status: ${eventsResponse.status}`);
        }
        const eventsData = await eventsResponse.json();
        setScores(eventsData.results || []);

      } catch (err) {
        setError(err.message);
        setScores([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (teamName) fetchTeamData();
    }, 500);

    return () => clearTimeout(timeoutId);
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
            <div className="search-wrapper mb-5">
              <i className="fas fa-search search-icon">🔍</i>
              <input
                type="text"
                className="search-input"
                placeholder="Enter team name (e.g., Arsenal, Barcelona)"
                value={teamName}
                onChange={handleTeamChange}
              />
            </div>

            {loading && (
              <div className="text-center">
                <div className="loading-spinner"></div>
                <p className="text-muted mt-3">Searching...</p>
              </div>
            )}

            {error && teamName && !loading && (
              <div className="text-center text-danger">
                <p>{error === "Team not found" ? "Team not found. Try another name." : error}</p>
              </div>
            )}

            {!loading && !error && scores && scores.length > 0 && (
              <div>
                <h3 className="text-white mb-4">Recent Matches for {teamName}</h3>
                <div className="d-flex flex-column gap-4">
                  {scores.map((event, index) => (
                    <motion.div
                      key={index}
                      className="glass-card p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="row align-items-center text-center">
                        <div className="col-md-4 mb-3 mb-md-0">
                          <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-3">
                            <span className="h5 mb-0 text-white">{event.strHomeTeam}</span>
                            {event.strHomeTeamBadge && (
                              <img src={event.strHomeTeamBadge} alt="" width="40" />
                            )}
                          </div>
                        </div>

                        <div className="col-md-4 mb-3 mb-md-0">
                          <div className="d-flex flex-column align-items-center">
                            <div className="h2 mb-1 text-primary fw-bold">
                              {event.intHomeScore} - {event.intAwayScore}
                            </div>
                            <small className="text-muted">
                              {new Date(event.dateEvent).toLocaleDateString()}
                            </small>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                            {event.strAwayTeamBadge && (
                              <img src={event.strAwayTeamBadge} alt="" width="40" />
                            )}
                            <span className="h5 mb-0 text-white">{event.strAwayTeam}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {!loading && !error && (!scores || scores.length === 0) && teamName && (
              <div className="text-center text-muted mt-4">
                <p>No recent matches found for "{teamName}".</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FootballScores;
