import {render} from 'react-dom'
import React from 'react'
import App from './App.jsx'
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
require("./css/style.css");
require("./css/typography.css");
require("./css/animate-sortello.css");

const containerEl = document.getElementById("container")
render(<App/>, containerEl)
