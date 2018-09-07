import React from "react"
import {find} from "lodash"
import Header from './Header.jsx';
import BoardSelector from './BoardSelector.jsx'
import ListSelector from './ListSelector.jsx'
import LabelSelector from './LabelSelector.jsx'
import queryString from "query-string";
import Footer from "./Footer.jsx"
import ProceedButton from "./ProceedButton.jsx"

class ColumnSelection extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            boards: [],
            lists: [],
            labels: [],
            groupedboards: [],
            organizations: [],
            fromExtension: false,
            boardId: null,
            isLabelSelected: false
        }
        this.getBoardColumns = this.getBoardColumns.bind(this);
        this.retrieveCardsByListId = this.retrieveCardsByListId.bind(this);
        this.handleBoardClicked = this.handleBoardClicked.bind(this);
        this.handleListClicked = this.handleListClicked.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleProceedButtonClicked = this.handleProceedButtonClicked.bind(this);
        this.getBoards = this.getBoards.bind(this);
        this.handleLabelClicked = this.handleLabelClicked.bind(this); 

    }

    componentDidMount () {
        let component = this;
        const params = queryString.parse(location.search);

        if (params.boardId !== undefined && params.listName !== undefined) {
            alert("Looks like you are using and outdated version of the Sortello Chrome Extension, please update. Thank you!");
        }

        if (params.extId !== undefined) {
            component.setState({fromExtension: true});
            component.props.Trello.cards.get(this.cleanForFirefoxAddon(params.extId), null, function (card) {
                component.retrieveCardsByListId(card.idList)
            });
        }

        if (this.state.organizations.length > 0) {
            return;
        }
        this.getBoards(Trello)
    }

    cleanForFirefoxAddon(str){
        return str.replace('#','');
    }

    getBoards (Trello) {
        let component = this
        Trello.members.get('me', {
            organizations: "all",
            organization_fields: "all",
            boards: "open",
            board_lists: "open"
        }, function (data) {
            let boardGroups = [];
            let boards = data.boards;
            let organizations = data.organizations;
            for (let i = 0; i < boards.length; i++) {
                let organization = find(organizations, {'id': boards[i].idOrganization});
                let groupName = "Other";
                if (organization !== undefined) {
                    groupName = organization.displayName;
                }
                if (!boardGroups[groupName]) {
                    boardGroups[groupName] = [];
                }
                boardGroups[groupName].push(boards[i]);
            }
            component.setState({
                boards: boards,
                groupedboards: boardGroups,
                organizations: organizations
            })

        }, function (e) {
            console.log(e);
        });
    }

    // labelSelected (labelId) {
    //     let listCards = this.state.listCards;
    //     if (labelId !== 0) {
    //         let label = find(this.state.labels, {'id': labelId});
    //         listCards = _.filter(this.state.listCards, function (card) {
    //             return find(card.labels, {'id': label.id}) !== undefined;
    //         });
    //     }
    //     this.props.handleCards(listCards, this.state.boardId);
    // }

    handleProceedButtonClicked (labelId) {
        let listCards = this.state.listCards;
        if (labelId !== 0) {
            let label = find(this.state.labels, {'id': labelId});
            listCards = _.filter(this.state.listCards, function (card) {
                return find(card.labels, {'id': label.id}) !== undefined;
            });
        }
        this.props.handleCards(listCards, this.state.boardId);
    }

    retrieveCardsByListId (listId) {
        let that = this;
        let labels = [];
        this.props.Trello.lists.get(listId, {cards: "open"}, function (data) {
            let listCards = data.cards;
            that.setState({
                listCards: listCards
            });
            listCards.forEach(function (card) {
                card.labels.forEach(function (label) {
                    if (find(labels, {'id': label.id}) === undefined) {
                        labels.push(label);
                    }
                });
            })
            that.setState({
                labels: labels,
                boardId: data.idBoard
            }, function () {
                if (this.state.labels.length === 0) {
                    that.labelSelected(0)
                }
            });
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
        this.setState({
            boardId: boardId
        })

        let board = find(this.state.boards, {'id': boardId});
        this.getBoardColumns(board)
    }

    handleListClicked (listId) {
        let list = find(this.state.lists, {'id': listId});
        this.retrieveCardsByListId(list.id);
    }

    handleLabelClicked (labelId) {
      this.setState({isLabelSelected:true})
    }

    renderBoardSelector () {
        if (this.state.fromExtension === true) {
            return ""
        }
        return <BoardSelector groupedboards={this.state.groupedboards}
                              onChange={this.handleBoardClicked}/>
    }

    renderListSelector () {
        if (this.state.lists.length === 0 || this.state.fromExtension === true) {
            return ""
        }
        return <ListSelector lists={this.state.lists}
                                onChange={this.handleListClicked}/>
    }

    renderLabelSelector () {
        if (this.state.labels.length === 0) {
            return ""
        }
        return <LabelSelector labels={this.state.labels} onChange={this.handleLabelClicked}/>
    }

    renderProceedButton () {
      if (!this.state.isLabelSelected) {
        return ""
      }
      return <ProceedButton onClick={this.handleProceedButtonClicked} />
    }

    render () {
        return (
            <div id="card_url_div">
                <div className="selection__wrapper">
                    <div>
                        <div className="selection__heading">
                            {
                                (this.state.fromExtension === true) ?
                                    "Filter by label, or select All" :
                                    "Welcome to sortello, Filippo"
                            }
                        </div>
                        <div className="selection__container selection__container--animation">
                          {this.renderBoardSelector()}
                          {this.renderListSelector()}
                          {this.renderLabelSelector()}
                          {this.renderProceedButton()}
                        </div>
                    </div>
                    <div className={"footer"}>
                        <Header/>
                        <Footer/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ColumnSelection
