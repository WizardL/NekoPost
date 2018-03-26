import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'

class About extends React.Component {
    render() {
        return (
            <Router>
                <section className="about-view">
                    <main className="content" role="main">
                        <article>
                            <div className="page-content about">
                                <h1>Introduction</h1>
                                <small>装逼 &middot; Bragging &middot; ひけらかす</small>

                                <div className="divider"></div>
                                <p>Any questions? <Link to="/faq">Read the FAQ.</Link>🐣</p>
                            </div>
                        </article>
                    </main>
                </section>
            </Router>
        )
    }
}

export default About;