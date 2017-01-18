import React from "react"
import {find} from "lodash"
import BoardSelector from './BoardSelector.jsx'

const ColumnSelection = React.createClass({
  getInitialState: function () {
    return {
      boards: [],
      lists: [],
      groupedboards: [],
    }
  },
  componentDidMount: function () {
    var Trello = this.props.Trello;
    var that = this;

    Trello.members.get('mazzcris', {organization: "true", boards: "open", board_lists: "open"}, function (data) {

      var boardGroups = [];
      var boards = data.boards
      for (var i = 0; i < boards.length; i++) {
        var groupName = boards[i].idOrganization;
        if (!boardGroups[groupName]) {
          boardGroups[groupName] = [];
        }
        boardGroups[groupName].push(boards[i]);
      }

      that.setState({
        boards: boards,
        groupedboards: boardGroups,
      })

    }, function (e) {
      console.log(e);
    });
  },
  retrieveCards: function () {
    var that = this
    var cardUrl = this.refs.card_url.value.replace("https://trello.com/c/", "");
    var cardId = cardUrl.replace(/\/(.*)/g, "")

    this.props.Trello.cards.get(cardId, null, function (data) {
      var idList = data.idList;
      var apiKey = localStorage.getItem('sortelloTrelloDevApiKey')
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
    return;
  },
  handleButtonClick: function () {
    if (this.refs.card_url.value.indexOf("https://trello.com/c/") < 0) {
      this.handleWrongUrl();
    }
    this.retrieveCards();
  },
  handleInputChange: function () {
    // console.log(this.refs.card_url.value);
    if (this.refs.card_url.value.indexOf("https://trello.com/c/") < 0) {
      this.handleWrongUrl();
    }
    this.retrieveCards();
  },
  handleBoardClicked: function (boardId) {

    var board = find(this.state.boards, { 'id' : boardId })

    this.getBoardColumns(board)
  },
  handleListClicked: function (list) {
    this.retrieveCardsByList(list);
  },
  render: function () {
    return (
        <div id="card_url_div">
          <div className={"centered_content"}>
            <BoardSelector groupedboards={this.state.groupedboards} onChange={this.handleBoardClicked} ></BoardSelector>
            <div>
              <hr/>
            </div>
            {
              this.state.lists.map(function (list) {
                return <button key={list.id} className={"btn btn-large"}
                               onClick={() => this.handleListClicked(list)}>{list.name}</button>
              }.bind(this))
            }

            <p>Or just paste the url of one card from the list you need to prioritize</p>
            <p>
              <input type="text" id="card_url" ref="card_url" defaultValue={""} onChange={this.handleInputChange}/>
            </p>
          </div>
        </div>
    )
  }
})

export default ColumnSelection
