import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

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
        const team = teamData.teams[0]; // Get the first team that matches

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
        setScores(eventsData.results); // Set the scores

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamName]); // Re-run the effect when teamName changes

  const handleTeamChange = (e) => {
    setTeamName(e.target.value);
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={15} md={6} lg={4} className="text-center">
          <h1>Football Scores</h1>

          {/* Input for changing team */}
          <input
            type="text"
            value={teamName}
            onChange={handleTeamChange}
            placeholder="Enter team name"
            className="form-control my-3"
          />

          {/* Loading and error messages */}
          {loading && <p>Loading football scores...</p>}
          {error && <p>Error: {error}</p>}

          {/* Scores section */}
          {!loading && !error && (
            <div className="cards" style={{ backgroundColor: 'lightgray', padding: '20px' }}>
              {scores.map((event, index) => (
                <div key={index}>
                  <p>Date: {event.dateEvent}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    {/* Home team */}
                    <div className="d-flex align-items-center">
                      <img 
                        src={event.strHomeTeamBadge} 
                        alt={`${event.strHomeTeam} logo`}
                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                      />
                      <span>{event.strHomeTeam}</span>
                    </div>
                    
                    {/* Score */}
                    <h2 className="mx-3">vs</h2>
                    
                    {/* Away team */}
                    <div className="d-flex align-items-center">
                      <span>{event.strAwayTeam}</span>
                      <img 
                        src={event.strAwayTeamBadge}
                        alt={`${event.strAwayTeam} logo`}
                        style={{ width: '50px', height: '50px', marginLeft: '10px' }}
                      />
                    </div>
                  </div>
                  <p>Score: {event.intHomeScore} - {event.intAwayScore}</p>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FootballScores;
