import {render} from 'react-dom'
import React from 'react'
import App from './App.jsx'
import Bootstrap from 'bootstrap/dist/css/bootstrap.css'
require("./style.css");

const containerEl = document.getElementById("container")
render(<App/>, containerEl)