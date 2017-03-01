import React from "react"
import {find} from "lodash"
import Header from './Header.jsx';
import BoardSelector from './BoardSelector.jsx'
import ListSelector from './ListSelector.jsx'

const ColumnSelection = React.createClass({
  getInitialState: function () {
    return {
      apiKey: this.props.apiKey,
      boards: [],
      lists: [],
      groupedboards: [],
      organizations: []
    }
  },
  componentDidUpdate: function () {

    if(this.state.organizations.length > 0){
      return;
    }

    var Trello = this.props.Trello;
    var that = this;

    Trello.members.get('me', { organizations: "all", organization_fields : "all", boards: "open", board_lists: "open"}, function (data) {
      var boardGroups = [];
      var boards = data.boards;
      var organizations = data.organizations;
      for (var i = 0; i < boards.length; i++) {
        var organization = find(organizations, {'id': boards[i].idOrganization});
        var groupName = "Other";
        if (organization !== undefined) {
          groupName = organization.displayName;
        }
        if (!boardGroups[groupName]) {
          boardGroups[groupName] = [];
        }
        boardGroups[groupName].push(boards[i]);
      }
      that.setState({
        boards: boards,
        groupedboards: boardGroups,
        organizations: organizations
      })

    }, function (e) {
      console.log(e);
    });
  },
  retrieveCards: function () {
    var that = this;
    var cardUrl = this.refs.card_url.value.replace("https://trello.com/c/", "");
    var cardId = cardUrl.replace(/\/(.*)/g, "");

    this.props.Trello.cards.get(cardId, null, function (data) {
      var idList = data.idList;
      var apiKey = localStorage.getItem('sortelloTrelloDevApiKey');
      jQuery.ajax({
        url: "https://api.trello.com/1/lists/" + idList + "/cards?key=" + apiKey + "&token=" + that.props.Trello.token(),
      }).done(function (data) {
        var listCards = data;
        that.props.handleCards(listCards);
      });
    }, function (e) {
      console.log(e);
    });
  },
  retrieveCardsByList: function (list) {
    var that = this;
    this.props.Trello.lists.get(list.id, {cards: "all"}, function (data) {
      var listCards = data.cards;
      that.props.handleCards(listCards);
    }, function (e) {
      console.log(e);
    });
  },
  getBoardColumns: function (board) {
    this.setState({
      lists: board.lists
    });
  },
  handleWrongUrl: function () {
    alert("This doesn't seem to be the url of a card :)");

  },
  handleButtonClick: function () {
    if (this.refs.card_url.value.indexOf("https://trello.com/c/") < 0) {
      this.handleWrongUrl();
    }
    this.retrieveCards();
  },
  handleBoardClicked: function (boardId) {

    var board = find(this.state.boards, {'id': boardId});

    this.getBoardColumns(board)
  },
  handleListClicked: function (listId) {
    var list = find(this.state.lists, {'id': listId});
    this.retrieveCardsByList(list);
  },
  render: function () {
    return (
        <div id="card_url_div">
            <div className={"centered_content"}>
                <div className="select-list--text-container">
                    <p>Select the board you want to prioritize</p>
                </div>
                <p>
                  <BoardSelector groupedboards={this.state.groupedboards}
                                              onChange={this.handleBoardClicked}></BoardSelector>
                </p>
                {
                    this.state.lists.length === 0 ?
                    "" :
                    <p><ListSelector lists={this.state.lists} onChange={this.handleListClicked} ></ListSelector></p>
                }
            </div>
        </div>
    )
  }
});

export default ColumnSelection
