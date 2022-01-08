import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

const chatbotDivs = document.querySelectorAll(".chatbot-serra-data")

chatbotDivs.forEach((chatBotDiv) => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    chatBotDiv
  )
}
)

