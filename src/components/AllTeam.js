import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, InputGroup, Tab, Tabs, Table } from 'react-bootstrap';

const AllTeam = () => {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [table, setTable] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [pastMatches, setPastMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [key, setKey] = useState('teams'); // Active tab key
    const { leagueName } = useParams();

    useEffect(() => {
        const fetchLeagueData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Teams to get League ID
                const teamsResponse = await axios.get('https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php', {
                    params: { l: leagueName }
                });

                const teamsData = teamsResponse.data.teams || [];
                setTeams(teamsData);
                setFilteredTeams(teamsData);

                if (teamsData.length > 0) {
                    const idLeague = teamsData[0].idLeague;

                    // 2. Fetch Current Season
                    const leagueResponse = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/lookupleague.php?id=${idLeague}`);
                    const currentSeason = leagueResponse.data.leagues ? leagueResponse.data.leagues[0].strCurrentSeason : '2025-2026';

                    // 3. Fetch Table and All Season Events in parallel
                    const [tableRes, seasonEventsRes] = await Promise.all([
                        axios.get(`https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${idLeague}&s=${currentSeason}`),
                        axios.get(`https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${idLeague}&s=${currentSeason}`)
                    ]);

                    setTable(tableRes.data.table || []);

                    const allSeasonEvents = seasonEventsRes.data.events || [];
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Separate into Past and Upcoming
                    const past = allSeasonEvents.filter(event => {
                        const eventDate = new Date(event.dateEvent);
                        return event.strStatus === 'Match Finished' || eventDate < today;
                    }).sort((a, b) => new Date(b.dateEvent) - new Date(a.dateEvent)); // Newest first

                    const upcoming = allSeasonEvents.filter(event => {
                        const eventDate = new Date(event.dateEvent);
                        return event.strStatus !== 'Match Finished' && eventDate >= today;
                    }).sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent)); // Soonest first

                    setUpcomingMatches(upcoming.slice(0, 15)); // Limit to 15
                    setPastMatches(past.slice(0, 15)); // Limit to 15
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching league data:", error);
                setError("Failed to load league data");
                setLoading(false);
            }
        };

        fetchLeagueData();
    }, [leagueName]);

    useEffect(() => {
        if (!teams) return;
        const results = teams.filter(team =>
            team.strTeam.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTeams(results);
    }, [searchTerm, teams]);

    if (loading) {
        return (
            <div className="text-center" style={{ marginTop: '100px' }}>
                <div className="loading-spinner"></div>
                <p className="text-muted mt-3">Loading league data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-danger" style={{ marginTop: '100px' }}>
                <h3>❌ Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <Container className="py-5">
                <div className="text-center mb-5">
                    <h1 className="page-title mb-4">
                        <span className="me-2">🏟️</span>
                        {leagueName}
                    </h1>
                </div>

                <Tabs
                    id="league-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-4 custom-tabs justify-content-center"
                >
                    <Tab eventKey="teams" title="Teams">
                        <div className="text-center mb-4">
                            <div className="search-wrapper mx-auto" style={{ maxWidth: '500px' }}>
                                <i className="fas fa-search search-icon">🔍</i>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder={`Search teams in ${leagueName}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <Row className="g-4">
                            {filteredTeams && filteredTeams.map((team, index) => (
                                <Col key={team.idTeam} xs={12} sm={6} md={4} lg={3}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Link to={`/team/${team.strTeam}`} style={{ textDecoration: 'none' }}>
                                            <div className="glass-card h-100 p-4 d-flex flex-column align-items-center justify-content-center text-center position-relative overflow-hidden group">
                                                <div className="mb-4 position-relative" style={{ width: '120px', height: '120px' }}>
                                                    <motion.img
                                                        src={team.strBadge}
                                                        alt={team.strTeam}
                                                        className="w-100 h-100 object-fit-contain"
                                                        style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    />
                                                </div>

                                                <h5 className="text-white fw-bold mb-2 text-truncate w-100" title={team.strTeam}>
                                                    {team.strTeam}
                                                </h5>

                                                {team.intFormedYear && (
                                                    <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-25 rounded-pill px-3">
                                                        Est. {team.intFormedYear}
                                                    </span>
                                                )}

                                                {/* Hover Effect Overlay */}
                                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary bg-opacity-10 opacity-0 transition-opacity duration-300 hover-overlay" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                        {filteredTeams.length === 0 && (
                            <div className="text-center text-muted py-5">
                                <p className="h5">No teams found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </Tab>

                    <Tab eventKey="standings" title="Points Table">
                        <div className="glass-panel p-4 overflow-auto">
                            <Table hover variant="dark" className="mb-0 bg-transparent">
                                <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th>Team</th>
                                        <th>P</th>
                                        <th>W</th>
                                        <th>D</th>
                                        <th>L</th>
                                        <th>GF</th>
                                        <th>GA</th>
                                        <th>GD</th>
                                        <th>Pts</th>
                                        <th>Form</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table && table.length > 0 ? (
                                        table.map((row) => (
                                            <tr key={row.idTeam}>
                                                <td>{row.intRank}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <img src={row.strBadge} alt="" width="25" height="25" />
                                                        <Link to={`/team/${row.strTeam}`} className="text-white text-decoration-none">
                                                            {row.strTeam}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td>{row.intPlayed}</td>
                                                <td>{row.intWin}</td>
                                                <td>{row.intDraw}</td>
                                                <td>{row.intLoss}</td>
                                                <td>{row.intGoalsFor}</td>
                                                <td>{row.intGoalsAgainst}</td>
                                                <td>{row.intGoalDifference}</td>
                                                <td className="fw-bold text-primary">{row.intPoints}</td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        {row.strForm && row.strForm.split('').map((char, i) => (
                                                            <span key={i} className={`badge ${char === 'W' ? 'bg-success' : char === 'D' ? 'bg-warning' : 'bg-danger'} p-1`} style={{ fontSize: '0.6rem', width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {char}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="text-center py-4">No standings available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            {table && table.length === 5 && (
                                <div className="text-center mt-3 text-muted small">
                                    * Showing top 5 teams due to API limitations
                                </div>
                            )}
                        </div>
                    </Tab>

                    <Tab eventKey="matches" title="Matches">
                        <Row>
                            <Col lg={6} className="mb-4 mb-lg-0">
                                <h3 className="text-white mb-4 border-start border-4 border-primary ps-3">Upcoming Matches</h3>
                                <div className="d-flex flex-column gap-3">
                                    {upcomingMatches && upcomingMatches.length > 0 ? (
                                        upcomingMatches.map((event, index) => (
                                            <div key={index} className="glass-card p-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <small className="text-muted">{new Date(event.dateEvent).toLocaleDateString()}</small>
                                                    <small className="text-muted">{event.strTime ? event.strTime.substring(0, 5) : ''}</small>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-2 justify-content-end" style={{ width: '45%' }}>
                                                        <span className="fw-bold text-end text-truncate">{event.strHomeTeam}</span>
                                                        {event.strHomeTeamBadge && <img src={event.strHomeTeamBadge} alt="" width="25" height="25" />}
                                                    </div>
                                                    <div className="px-2 text-muted">vs</div>
                                                    <div className="d-flex align-items-center gap-2 justify-content-start" style={{ width: '45%' }}>
                                                        {event.strAwayTeamBadge && <img src={event.strAwayTeamBadge} alt="" width="25" height="25" />}
                                                        <span className="fw-bold text-start text-truncate">{event.strAwayTeam}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted text-center py-4 glass-panel">No upcoming matches</div>
                                    )}
                                </div>
                            </Col>
                            <Col lg={6}>
                                <h3 className="text-white mb-4 border-start border-4 border-secondary ps-3">Recent Results</h3>
                                <div className="d-flex flex-column gap-3">
                                    {pastMatches && pastMatches.length > 0 ? (
                                        pastMatches.map((event, index) => (
                                            <div key={index} className="glass-card p-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <small className="text-muted">{new Date(event.dateEvent).toLocaleDateString()}</small>
                                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">FT</span>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-2 justify-content-end" style={{ width: '40%' }}>
                                                        <span className="fw-bold text-end text-truncate">{event.strHomeTeam}</span>
                                                        {event.strHomeTeamBadge && <img src={event.strHomeTeamBadge} alt="" width="25" height="25" />}
                                                    </div>
                                                    <div className="px-3 py-1 bg-dark bg-opacity-50 rounded-pill border border-secondary border-opacity-25 fw-bold text-nowrap">
                                                        {event.intHomeScore} - {event.intAwayScore}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 justify-content-start" style={{ width: '40%' }}>
                                                        {event.strAwayTeamBadge && <img src={event.strAwayTeamBadge} alt="" width="25" height="25" />}
                                                        <span className="fw-bold text-start text-truncate">{event.strAwayTeam}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted text-center py-4 glass-panel">No recent results</div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </Container>
        </div>
    );
};

export default AllTeam;
