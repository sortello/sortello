import React from "react"
import {find} from "lodash"
import Header from './Header.jsx';
import BoardSelector from './BoardSelector.jsx'
import ListSelector from './ListSelector.jsx'
import queryString from "query-string";

const ColumnSelection = React.createClass({
  getInitialState: function () {
    return {
      boards: [],
      lists: [],
      groupedboards: [],
      organizations: []
    }
  },
  componentDidUpdate(){
    this.props.centerContent();
  },
  componentDidMount: function () {
    var Trello = this.props.Trello;

    var that = this;
    const params = queryString.parse(location.search);
    if (params.boardId !== undefined && params.listName !== undefined) {
      var boardId = params.boardId;
      var listName = params.listName;
      Trello.boards.get(boardId, {
        organizations: "all",
        organization_fields: "all",
        lists: "open",
        list_fields: "all"
      }, function (board) {
        for (var i = 0; i < board.lists.length; i++) {
          var list = board.lists[i];
          if (list.name === listName) {
            that.retrieveCardsByList(list)
          }
        }
      }, function (e) {
        console.log(e);
      });
    }

    this.props.centerContent();
    if (this.state.organizations.length > 0) {
      return;
    }


    Trello.members.get('me', {
      organizations: "all",
      organization_fields: "all",
      boards: "open",
      board_lists: "open"
    }, function (data) {
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
  retrieveCardsByList: function (list) {
    var that = this;
    this.props.Trello.lists.get(list.id, {cards: "open"}, function (data) {
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
          <div className="centered_content">
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
                  <p><ListSelector lists={this.state.lists} onChange={this.handleListClicked}></ListSelector></p>
            }
          </div>
        </div>
    )
  }
});

export default ColumnSelection
