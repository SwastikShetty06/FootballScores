import React from 'react';
const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="mb-4">
                        <h3 className="brand-logo mb-2">FootballScores</h3>
                        <p className="text-muted">Your ultimate destination for football stats and scores.</p>
                    </div>

                    <div className="d-flex justify-content-center gap-4 mb-4">
                        <a href="https://github.com/SwastikShetty06/FootballScores"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                        >
                            <img
                                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark-Light-64px.png"
                                alt="GitHub"
                                width="32"
                                height="32"
                                style={{ opacity: 0.8, transition: 'opacity 0.2s' }}
                                onMouseOver={(e) => e.target.style.opacity = 1}
                                onMouseOut={(e) => e.target.style.opacity = 0.8}
                            />
                        </a>
                    </div>

                    <div className="border-top border-secondary pt-4 mt-4" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                        <p className="mb-0 text-muted small">
                            © {new Date().getFullYear()} Swastik Shetty. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
