import React from "react"
import ApiKey from "./components/ApiKey.jsx"
import ColumnSelection from "./components/ColumnSelection.jsx"
import Choices from "./components/Choices.jsx"
import Results from "./components/Results.jsx"
import treeNodeFactory from "./model/treeNodeFactory"

const App = React.createClass({
  getInitialState: function () {
    return {
      apiKey: false,
      Trello: Trello,
      nodes: Array(),
      rootNode: null,
      currentView: 1 // 1-ApiKey 2-ColumnSelect 3-Choices 4-SendDataToServer
    };
  },
  componentDidMount: function () {
    jQuery(".centered_content").each(function () {
      var content_height = jQuery(this).outerHeight();
      var viewport_height = jQuery(document).innerHeight();
      var padding_top = (viewport_height / 2) - content_height;
      jQuery(this).css('padding-top', padding_top + 'px');
    });

    jQuery('.choice_button .card_link').click(function (e) {
      e.stopPropagation();
    });
  },
  setApiKey: function (apiKey) {
    this.setState({
      apiKey: apiKey,
      currentView : 2
    });
  },
  handleCards: function (listCards) {
    var nodes = [];
    for (var i = 0; i < listCards.length; i++) {
      var node = treeNodeFactory(listCards[i]);
      nodes.push(node);
    }
    this.setState({
      nodes: nodes,
      rootNode: nodes[0],
      currentView: 3
    })
    this.refs.choices.startChoices();
  },
  setSortedRootNode: function (rootNode) {
    this.setState({
      rootNode: rootNode,
      currentView: 4
    })
  },
  render: function () {
    if (2 == this.state.currentView) {
      document.getElementById("api_key_div").style.marginTop = -1 * document.getElementById("api_key_div").offsetHeight
    }
    if (3 == this.state.currentView) {
      document.getElementById("card_url_div").style.marginTop = -1 * document.getElementById("card_url_div").offsetHeight
    }
    if (4 == this.state.currentView) {
      document.getElementById("card_url_div").style.marginTop = -2 * document.getElementById("card_url_div").offsetHeight
    }

    return (
        <div id="container_div">
          <ApiKey apikey={this.state.apiKey} Trello={this.state.Trello} setApiKey={this.setApiKey} />
          <ColumnSelection apikey={this.state.apiKey} Trello={this.state.Trello} handleCards={this.handleCards}/>
          <Choices ref="choices" setSortedRootNode={this.setSortedRootNode} nodes={this.state.nodes} rootNode={this.state.rootNode} />
          <Results rootNode={this.state.rootNode} Trello={this.state.Trello}/>
        </div>
    )
  },
})

export default App
