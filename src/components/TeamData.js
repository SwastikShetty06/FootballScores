import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

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
        return <h2>Loading...</h2>;  
    }

    return (
        <div>
            <center>
                <h1>{teamName}</h1>
                {team && (
                    <div style={{ width: '35%' }} className="cards">
                        <div>
                            {scores.length > 0 ? (
                                scores.map((event, index) => (
                                    <div className="cardIn" key={index}> 
                                        <p>Date: {event.dateEvent}</p>
                                        <div>
                                            <p>
                                                <img 
                                                    src={event.strHomeTeamBadge} 
                                                    alt={`${event.strHomeTeam} logo`}
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                                {event.strHomeTeam} <h2 className="pInF">vs</h2> {event.strAwayTeam}
                                                <img
                                                    src={event.strAwayTeamBadge}
                                                    alt={`${event.strAwayTeam} logo`}
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                            </p>
                                            <p>Score: {event.intHomeScore} - {event.intAwayScore}</p>
                                        </div>
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p>No recent matches found.</p>  
                            )}
                        </div>
                    </div>
                )}
            </center>
        </div>
    );
};

export default TeamData;
