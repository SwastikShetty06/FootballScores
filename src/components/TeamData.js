import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

const TeamData = () => {
    const { teamName } = useParams();
    const [scores, setScores] = useState([]);
    const [nextEvents, setNextEvents] = useState([]); // Added new state for upcoming events
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // 1. Fetch Team Details
                const teamResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${teamName}`);
                const teamData = await teamResponse.json();
                const currentTeam = teamData.teams ? teamData.teams[0] : null;

                if (currentTeam) {
                    setTeam(currentTeam);

                    // 2. Fetch League Details to get Current Season
                    const leagueResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupleague.php?id=${currentTeam.idLeague}`);
                    const leagueData = await leagueResponse.json();
                    const currentSeason = leagueData.leagues ? leagueData.leagues[0].strCurrentSeason : '2025-2026';

                    // 3. Fetch All Season Events (we use this for BOTH past and upcoming because eventsnext.php is unreliable)
                    const seasonEventsResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${currentTeam.idLeague}&s=${currentSeason}`);
                    const seasonEventsData = await seasonEventsResponse.json();
                    const allSeasonEvents = seasonEventsData.events || [];

                    // Filter for this team
                    const teamEvents = allSeasonEvents.filter(event =>
                        event.idHomeTeam === currentTeam.idTeam || event.idAwayTeam === currentTeam.idTeam
                    );

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Separate into Past and Upcoming
                    const past = teamEvents.filter(event => {
                        const eventDate = new Date(event.dateEvent);
                        return event.strStatus === 'Match Finished' || eventDate < today;
                    }).sort((a, b) => new Date(b.dateEvent) - new Date(a.dateEvent)); // Newest first

                    const upcoming = teamEvents.filter(event => {
                        const eventDate = new Date(event.dateEvent);
                        return event.strStatus !== 'Match Finished' && eventDate >= today;
                    }).sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent)); // Soonest first

                    setScores(past);
                    setNextEvents(upcoming.slice(0, 5)); // Limit upcoming to 5
                }
            } catch (error) {
                console.error("Error fetching team data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [teamName]);

    if (loading) {
        return (
            <div className="text-center">
                <div className="loading-spinner"></div>
                <p className="text-muted mt-3">Loading team data...</p>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="text-center text-danger mt-5">
                <h3>Team Not Found</h3>
                <p>Could not find data for "{teamName}". Please try again.</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Compact Header */}
            <div className="glass-panel mb-4 py-4 px-4">
                <Container>
                    <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                        {team.strTeamBadge && (
                            <motion.img
                                src={team.strTeamBadge}
                                alt={team.strTeam}
                                style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            />
                        )}
                        <div className="text-center text-md-start">
                            <h1 className="mb-1 text-white" style={{ fontSize: '2.5rem', fontWeight: '700' }}>{team.strTeam}</h1>
                            <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                                {team.strLeague && <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25">{team.strLeague}</span>}
                                {team.strCountry && <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-25">{team.strCountry}</span>}
                                {team.intFormedYear && <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25">Est. {team.intFormedYear}</span>}
                            </div>
                        </div>
                    </div>
                    {team.strDescriptionEN && (
                        <div className="mt-4 text-muted border-top border-secondary pt-3 border-opacity-25">
                            <p className="mb-0 small" style={{ lineHeight: '1.6' }}>
                                {team.strDescriptionEN.substring(0, 300)}...
                            </p>
                        </div>
                    )}
                </Container>
            </div>

            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} lg={10}>
                        {/* Upcoming Matches Section */}
                        {nextEvents && nextEvents.length > 0 && (
                            <div className="mb-5">
                                <h3 className="mb-4 text-white border-start border-4 border-warning ps-3">Upcoming Matches</h3>
                                <div className="d-flex flex-column gap-3">
                                    {nextEvents.map((event, index) => (
                                        <motion.div
                                            key={event.idEvent}
                                            className="glass-card p-3"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.01, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                        >
                                            <div className="row align-items-center">
                                                <div className="col-12 col-md-2 text-muted small mb-2 mb-md-0">
                                                    {new Date(event.dateEvent).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="col-12 col-md-8">
                                                    <div className="d-flex align-items-center justify-content-between justify-content-md-center gap-md-5">
                                                        <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-end" style={{ flexBasis: '40%' }}>
                                                            <span className="text-white fw-medium text-end d-none d-sm-block">{event.strHomeTeam}</span>
                                                            <span className="text-white fw-medium text-end d-block d-sm-none small">{event.strHomeTeam.substring(0, 3).toUpperCase()}</span>
                                                            {event.strHomeTeamBadge && <img src={event.strHomeTeamBadge} alt="" width="30" height="30" />}
                                                        </div>
                                                        <div className="px-3 py-1 bg-dark bg-opacity-50 rounded-pill border border-secondary border-opacity-25 text-white fw-bold text-nowrap">
                                                            {event.strTime ? event.strTime.substring(0, 5) : 'VS'}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-start" style={{ flexBasis: '40%' }}>
                                                            {event.strAwayTeamBadge && <img src={event.strAwayTeamBadge} alt="" width="30" height="30" />}
                                                            <span className="text-white fw-medium text-start d-none d-sm-block">{event.strAwayTeam}</span>
                                                            <span className="text-white fw-medium text-start d-block d-sm-none small">{event.strAwayTeam.substring(0, 3).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-2 text-end mt-2 mt-md-0">
                                                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">Upcoming</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Results Section */}
                        <h3 className="mb-4 text-white border-start border-4 border-primary ps-3">Recent Results</h3>

                        <div className="d-flex flex-column gap-3">
                            {scores && scores.length > 0 ? (
                                scores.map((event, index) => (
                                    <motion.div
                                        key={event.idEvent}
                                        className="glass-card p-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                    >
                                        <div className="row align-items-center">
                                            {/* Date */}
                                            <div className="col-12 col-md-2 text-muted small mb-2 mb-md-0">
                                                {new Date(event.dateEvent).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>

                                            {/* Match Details */}
                                            <div className="col-12 col-md-8">
                                                <div className="d-flex align-items-center justify-content-between justify-content-md-center gap-md-5">
                                                    {/* Home Team */}
                                                    <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-end" style={{ flexBasis: '40%' }}>
                                                        <span className="text-white fw-medium text-end d-none d-sm-block">{event.strHomeTeam}</span>
                                                        <span className="text-white fw-medium text-end d-block d-sm-none small">{event.strHomeTeam.substring(0, 3).toUpperCase()}</span>
                                                        {event.strHomeTeamBadge && <img src={event.strHomeTeamBadge} alt="" width="30" height="30" />}
                                                    </div>

                                                    {/* Score */}
                                                    <div className="px-3 py-1 bg-dark bg-opacity-50 rounded-pill border border-secondary border-opacity-25 text-white fw-bold text-nowrap">
                                                        {event.intHomeScore} - {event.intAwayScore}
                                                    </div>

                                                    {/* Away Team */}
                                                    <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-start" style={{ flexBasis: '40%' }}>
                                                        {event.strAwayTeamBadge && <img src={event.strAwayTeamBadge} alt="" width="30" height="30" />}
                                                        <span className="text-white fw-medium text-start d-none d-sm-block">{event.strAwayTeam}</span>
                                                        <span className="text-white fw-medium text-start d-block d-sm-none small">{event.strAwayTeam.substring(0, 3).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="col-12 col-md-2 text-end mt-2 mt-md-0">
                                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Finished</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center text-muted py-5 glass-panel">
                                    <p className="h5 mb-0">No recent matches found</p>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default TeamData;
