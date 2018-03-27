import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'

class FAQ extends React.Component {
    render() {
        // This is rarely a faq >.>
        return (
            <BrowserRouter>
                <section class="about-view">
                    <main class="content" role="main">
                        <article>
                            <div class="page-content about">
                                <h1>FAQ</h1>
                                <small>问题 &middot; Problem &middot; 質問</small>
                                <h2>What is NekoPost?</h2>
                                <strong>NekoPost is a simple platform that lets you
                                        to communicate your ideas freely.</strong>

                                <h2>Can I advertise/sponsor NekoPost?</h2>
                                <p>Yes please! 😻</p>

                                <h2>What is the tech stack of NekoPost?</h2>
                                <p>Glad you asked! It's written in HTML, CSS 
                                (😾 of course) and Node.js, using React
                                framework for the single-page app development.
                                Hosted on a Ubuntu running Nginx for reverse proxy.
                                </p>

                                <p>For more information you may take a look at 
                                <Link to="#"> here.</Link>
                                </p>
                            </div>
                        </article>
                    </main>
                </section>
            </BrowserRouter>
        )
    }
}

export default FAQ;