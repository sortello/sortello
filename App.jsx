import React from "react"
import ApiKey from "./components/ApiKey.jsx"
import ColumnSelection from "./components/ColumnSelection.jsx"
import Choices from "./components/Choices.jsx"
import Results from "./components/Results.jsx"
import treeNodeFactory from "./model/treeNodeFactory"

const App = React.createClass({
  getInitialState: function () {
    return {
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
  handleAuthentication: function () {
    this.setState({
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
  getCurrentView: function (viewNumber) {
    switch (this.state.currentView) {
      case 1:
        return (<ApiKey Trello={this.state.Trello} onAuthentication={this.handleAuthentication}/>);
      case 2:
        return (<ColumnSelection Trello={this.state.Trello} handleCards={this.handleCards} />);
      case 3:
        return (<Choices ref="choices" setSortedRootNode={this.setSortedRootNode} nodes={this.state.nodes} rootNode={this.state.rootNode} />);
      case 4:
        return (<Results rootNode={this.state.rootNode} Trello={this.state.Trello}/>);
      default:
        return (<h3>Error</h3>);
    }
  },
  render: function () {
    return (
        <div id="container_div">
          {this.getCurrentView()}
        </div>
    )
  },
})

export default App
