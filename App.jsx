import React from "react"
import Authentication from "./components/Authentication.jsx"
import ColumnSelection from "./components/ColumnSelection.jsx"
import Choices from "./components/Choices.jsx"
import ChoicesVoter from "./components/ChoicesVoter.jsx"
import Results from "./components/Results.jsx"
import treeNodeFactory from "./model/treeNodeFactory"
import queryString from "query-string"
import TrelloApi from "./api/TrelloApi"
import GithubApi from "./api/GithubApi"

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            BoardApi: new TrelloApi(),
            nodes: Array(),
            rootNode: null,
            currentView: 1,
            startTimeStamp: null,// 1-Authentication 2-ColumnSelect 3-Choices 4-SendDataToServer
            boardId: null,
            fromExtension: null,
            extId:null
        };
        this.getCurrentView = this.getCurrentView.bind(this);
        this.setStartTimeStamp = this.setStartTimeStamp.bind(this);
        this.setSortedRootNode = this.setSortedRootNode.bind(this);
        this.setSortedRootNode = this.setSortedRootNode.bind(this);
        this.handleCards = this.handleCards.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.choice = this.choice.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount () {
        jQuery('.choice_button .card_link').click(function (e) {
            e.stopPropagation();
        });

        const params =  queryString.parse(location.search);

        if(this.choice("ext")) {
                this.setState({
                    fromExtension: params.fw === 'g' ? "Github" : "Trello",
                    extId: params.extId,
                    BoardApi: params.fw === 'g' ? new GithubApi() : new TrelloApi()
                }, function () {
                    if(!localStorage.getItem("token")) {
                        localStorage.setItem('extId', this.state.extId);
                        localStorage.setItem('fromExtension', this.state.fromExtension);
                        localStorage.removeItem("code");
                    }else{
                        this.handleAuthentication()
                    }
                })
        }

        if(this.choice("code")) {
            let code = window.location.href.match(/\?code=(.*)/)[1];
            this.setState({
                fromExtension: localStorage.getItem("fromExtension"),
                BoardApi: new GithubApi()
            }, function () {
                localStorage.setItem("code",code);
                this.state.BoardApi.authenticate(this.handleAuthentication)
            })
        }
        if (params.boardId !== undefined && params.listName !== undefined) {
            alert("Looks like you are using and outdated version of the Sortello Chrome Extension, please update. Thank you!");
        }
    }

    choice(p){
        const params =  queryString.parse(location.search);
        if(p==="ext"){
            return params.extId!==undefined
        }else{
            return params.code !== undefined && !localStorage.getItem("code")
        }
    }

    handleAuthentication () {
        const params = queryString.parse(location.search);
        if (params.roomKey !== undefined) {
            this.setState({
                rootNode: [],
                nodes: [],
                currentView: 5
            })
        } else {
            this.setState({
                currentView: 2
            },function(){
                console.log(this.state.BoardApi)
            })
        }
    }

    handleCards (listCards, boardId) {
        let that = this;
        let nodes = [];
        for (let i = 0; i < listCards.length; i++) {
            let node = treeNodeFactory(listCards[i]);
            nodes.push(node);
        }
        this.setState({
            boardId: boardId,
            rootNode: nodes.shift(),
            nodes: nodes,
            currentView: 3
        }, function () {
            that.refs.choices.startChoices();
        })
    }

    setSortedRootNode (rootNode) {
        this.setState({
            rootNode: rootNode,
            currentView: 4
        })
    }

    setStartTimeStamp (timeStamp) {
        this.setState({
            startTimeStamp: timeStamp
        })
    }

    renderAuthenticationForm () {
        return <Authentication BoardApi={this.state.BoardApi} onAuthentication={this.handleAuthentication}
                                fromExtension={this.state.fromExtension}/>
    }

    renderColumnSelection () {
        return <ColumnSelection BoardApi={this.state.BoardApi} handleCards={this.handleCards}
                                fromExtension={this.state.fromExtension}
                                extId={this.state.extId}/>
    }

    renderChoicesVoter () {
        return (
            <ChoicesVoter BoardApi={this.state.BoardApi}
                          ref="choicesVoter" setSortedRootNode={this.setSortedRootNode}
                          setStartTimeStamp={this.setStartTimeStamp}
                          nodes={this.state.nodes}
                          rootNode={this.state.rootNode}/>
        )
    }

    renderChoices () {
        return (
            <Choices BoardApi={this.state.BoardApi}
                     ref="choices" setSortedRootNode={this.setSortedRootNode}
                     setStartTimeStamp={this.setStartTimeStamp}
                     nodes={this.state.nodes}
                     boardId={this.state.boardId}
                     rootNode={this.state.rootNode}/>
        )
    }

    renderResults () {
        return (
            <Results rootNode={this.state.rootNode} BoardApi={this.state.BoardApi}
                     startTimeStamp={this.state.startTimeStamp}/>
        )
    }

    renderError(){
        return <h3>Error</h3>
    }

    getCurrentView () {
        switch (this.state.currentView) {
            case 1:
                return this.renderAuthenticationForm()
            case 2:
                return this.renderColumnSelection()
            case 3:
                return this.renderChoices()
            case 4:
                return this.renderResults()
            case 5:
                return this.renderChoicesVoter()
            default:
                return this.renderError()
        }
    }

    render () {
        return (
            <div id="container_div">
                {this.getCurrentView()}
            </div>
        )
    }
}

export default App
