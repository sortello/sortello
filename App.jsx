import React from "react" // ES6 import
import ApiKey from "./components/ApiKey.jsx"
import ColumnSelection from "./components/ColumnSelection.jsx"
import Choices from "./components/Choices.jsx"
import Results from "./components/Results.jsx"

const App = React.createClass({
    render: function() {
        return (
            <div id="container_div">
                <ApiKey />
                <ColumnSelection />
                <Choices />
                <Results />
            </div>
        )
    },
})

export default App // important