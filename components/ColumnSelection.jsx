import React from "react"
import {find} from "lodash"
import Header from './Header.jsx';
import BoardSelector from './BoardSelector.jsx'
import ListSelector from './ListSelector.jsx'
import queryString from "query-string";
import Footer from "./Footer.jsx"


class ColumnSelection extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      boards: [],
      lists: [],
      groupedboards: [],
      organizations: []
    };
    this.getBoardColumns = this.getBoardColumns.bind(this);
    this.retrieveCardsByListId = this.retrieveCardsByListId.bind(this);
    this.handleBoardClicked = this.handleBoardClicked.bind(this);
    this.handleListClicked = this.handleListClicked.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

  }

  componentDidMount () {
    var Trello = this.props.Trello;

    var that = this;
    const params = queryString.parse(location.search);

    if (params.boardId !== undefined && params.listName !== undefined) {
      alert("Looks like you are using and outdated version of the Sortello Chrome Extension, please update. Thank you!");
    }

    if (params.extId !== undefined) {
      Trello.cards.get(params.extId, null, function (card) {
        that.retrieveCardsByListId(card.idList)
      });
    }

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
  }

  retrieveCardsByListId (listId) {
    var that = this;
    this.props.Trello.lists.get(listId, {cards: "open"}, function (data) {
      var listCards = data.cards;
      that.props.handleCards(listCards);
    }, function (e) {
      console.log(e);
    });
  }

  getBoardColumns (board) {
    this.setState({
      lists: board.lists
    });
  }

  handleBoardClicked (boardId) {

    var board = find(this.state.boards, {'id': boardId});

    this.getBoardColumns(board)
  }

  handleListClicked (listId) {
    var list = find(this.state.lists, {'id': listId});
    this.retrieveCardsByListId(list.id);
  }

  render () {
    return (
      <div id="card_url_div">
        <div className="selection__wrapper">
          <div className="selection__container selection__container--animation">
            <div className="select-list--text-container selection__heading">
              First of all, select the board you want to prioritize
            </div>
            <div className="">
              <BoardSelector groupedboards={this.state.groupedboards}
                             onChange={this.handleBoardClicked}></BoardSelector>
            </div>
            {
              this.state.lists.length === 0 ?
                "" :
                <p><ListSelector lists={this.state.lists} onChange={this.handleListClicked}></ListSelector></p>
            }
          </div>
        </div>
        <div className={"logout__button logout__fade-in"}>
          <Header/>
        </div>
        <div className={"footer footer__fade-in"}>
          <Footer/>
        </div>
      </div>
    )
  }
};

export default ColumnSelection
