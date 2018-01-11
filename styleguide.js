import {render} from 'react-dom'
import React from 'react'
import StyleguideApp from './StyleguideApp.jsx'
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
import "./css/style.css";
import "./css/animate-sortello.css";
import "./css/buttons.css";
import "./css/api-key.css";
import "./css/board-column__selection.css";
import "./css/choices.css";
import "./css/responsive/board-column-selection__responsive.css";
import "./css/responsive/choices__responsive.css";
import "./css/logout-button.css";
import "./css/responsive/logout-button__responsive.css";
import "./css/footer.css";
import "./css/responsive/footer__responsive.css";
import "./css/responsive/api-key__responsive.css";
import "./css/responsive/disclaimer__responsive.css";
import "./css/disclaimer.css";
import "./css/send-ordered.css";
import "./css/send-success.css";
import "./css/responsive/send-success__responsive.css";
import "./css/responsive/send-ordered__responsive.css";
import "./css/recap.css";
import "./css/responsive/recap__responsive.css";

const containerEl = document.getElementById("container")
render(<StyleguideApp/>, containerEl)
