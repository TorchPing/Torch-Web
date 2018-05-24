import React, { Component } from 'react'
import Navbar from './Navbar'
import Footbar from './Footbar'
import PingCard from './PingCard'
import './App.css'

class App extends Component {
  render() {
    return (
        <div>
            <Navbar />
            <div>
                <PingCard host="www.baidu.com" port="443" />
                <PingCard host="www.google.com" port="443" />
            </div>
            <Footbar />
        </div>
    )
  }
}

export default App;
