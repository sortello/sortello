class TrelloApi {

    putCards (cardId, pos, success, error) {
        Trello.put('/cards/' + cardId, {pos: pos}, success, error);
    }

    getMembers (memberId, params, success, error) {
        Trello.members.get(memberId, params, success, error);
    }

    getBoard(boardId,success,error){
        Trello.boards.get(boardId, success,error)
    }
}

export default TrelloApi;