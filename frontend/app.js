import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import About from './views/about.js'
import FAQ from './views/faq.js'

// Required for Webpack to find it
import Stylesheet from './style/app.scss'

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <nav className="navigation"> 
                        <div><Link to="/"><img id="logo" src="logo.png" alt="logo"/></Link></div>
                        <ul>
                            <li><Link to="/post_now">Post</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/about">About us</Link></li>
                        </ul>
                    </nav>

                    <main className="content" role="main">
                        <transition name="fade" mode="out-in">
                            <Route path="/post_now" component={() => <p>Post</p>} />
                            <Route path="/faq" component={FAQ} />
                            <Route path="/about" component={About} />
                            <Route exact path="/" component={() => <p>Post</p>} />
                        </transition>
                    </main>
                </div>
            </Router>
        )
    }
}

export default App;