import React, { useState, useEffect } from "react";

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
    <div>
      <h1>Football Scores</h1>
      
      <input
        type="text"
        value={teamName}
        onChange={handleTeamChange}
        placeholder="Enter team name"
      />
      
      {loading && <p>Loading football scores...</p>}
      {error && <p>Error: {error}</p>}

      <div>
        {scores.map((event, index) => (
          <div key={index}> 
            <p>Date: {event.dateEvent}</p>
            <div>
              <p><img 
                src={event.strHomeTeamBadge} // Home team logo
                alt={`${event.strHomeTeam} logo`}
                style={{ width: '50px', height: '50px' }}
              />{event.strHomeTeam} <h2 className="pInF">vs</h2>  {event.strAwayTeam}
              <img
                src={event.strAwayTeamBadge} // Away team logo
                alt={`${event.strAwayTeam} logo`}
                style={{ width: '50px', height: '50px' }}
              /></p>
              <p>  Score: {event.intHomeScore} - {event.intAwayScore}</p>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FootballScores;
