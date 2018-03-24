import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

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
                            <Route path="/faq" component={() => <p>FAQ</p>} />
                            <Route path="/about" component={() => <p>About</p>} />
                            <Route exact path="/" component={() =>{<p>Post</p>}} />
                        </transition>
                    </main>
                </div>
            </Router>
        )
    }
}

export default App;