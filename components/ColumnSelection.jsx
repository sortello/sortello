import React from "react"

const ColumnSelection = React.createClass({

  retrieveCards: function () {
    var that = this
    var cardUrl = document.getElementById('card_url').value.replace("https://trello.com/c/", "");
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
  render: function () {
    return (
        <div id="card_url_div">
          <div className={"centered_content"}>
            <p>Paste the url of one card from the column you need to prioritize and press The button</p>
            <p>
              <input type="text" id="card_url"/>
            </p>
            <p>
              <button className={"btn btn-large"} id="retrieve_cards" onClick={this.retrieveCards}>The button
              </button>
            </p>
          </div>
        </div>
    )
  }
})

export default ColumnSelection
