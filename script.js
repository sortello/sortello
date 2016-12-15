var cards = [];

jQuery('#retrieve_cards').click(function(){
    retrieveCards();
});

function retrieveCards() {
    var cardUrl = jQuery('#card_url').val().replace("https://trello.com/c/", "");
    cardId = cardUrl.replace(/\/(.*)/g, "")
    Trello.cards.get(cardId, null, function (data) {
        var idList = data.idList;
        jQuery.ajax({
            url: "https://api.trello.com/1/lists/" + idList + "/cards?key=" + apiKey + "&token=" + Trello.token(),
        }).done(function (data) {
            listCards = data;
            handleCards(listCards);
            cards = listCards;
        });
    }, function () {
        console.log("Error in Trello.cards.get");
    });
};

var nodes = Array();
var rootNode;

function handleCards(listCards) {
    for (var i = 0; i < listCards.length; i++) {
        var node = new TreeNode(listCards[i]);
        nodes.push(node);
    }
    rootNode = nodes[0];
    navigateTo("second_div");
    startChoices(1);
}

function startChoices(currNode) {
    if (currNode < nodes.length) {
        getChoice(nodes[currNode], rootNode, currNode);
    } else {
        jQuery("#left_button").html("");
        jQuery("#right_button").html("");
        navigateTo("last_div");
    }
}

function getChoice(node, compareNode, currNode) {
    jQuery("#left_button h1").html(node.value.name);
    jQuery("#left_button .card_content").html(node.value.desc);
    jQuery("#left_button .card_link").prop("href", node.value.shortUrl);
    jQuery("#right_button h1").html(compareNode.value.name);
    jQuery("#right_button .card_content").html(compareNode.value.desc);
    jQuery("#right_button .card_link").prop("href", compareNode.value.shortUrl);
    jQuery(".choice_button").click(function () {
        if ($(this).attr("id") == "left_button") {
            compareNode = node.goLeft(compareNode);
        } else if ($(this).attr("id") == "right_button") {
            compareNode = node.goRight(compareNode);
        }
        jQuery(".choice_button").unbind("click");
        if (node.isPositioned) {
            startChoices(currNode + 1);
        } else {
            getChoice(node, compareNode, currNode);
        }
    });

}

function navigateTo(divId) {
    if ("card_url_div" == divId) {
        jQuery('#api_key_div').animate({'margin-top': -1 * jQuery('#api_key_div').outerHeight()});
    }

    if ("second_div" == divId) {
        jQuery('#card_url_div').animate({'margin-top': -1 * jQuery('#card_url_div').outerHeight()});
        jQuery('#card_url').click();
    }

    if ("last_div" == divId) {
        jQuery('#card_url_div').animate({'margin-top': -2 * jQuery('#card_url_div').outerHeight()});
    }
}

function showUploadDone() {
    jQuery(".almost").css("text-decoration", "line-through");
    jQuery(".done").text("Done!");
    jQuery("#update_board").fadeTo(500, 0, function () {
        jQuery("#update_board").animate({
            "width": "0px",
            "padding": "0px"
        });
        jQuery(".checkboard").css("display", "inline-block");
    });
}


jQuery('#update_board').click(function () {
    updateBoard();
});

function updateBoard(){
    console.log(rootNode);
    var reorderedNodes = traverseTree(rootNode);
    var putCalls = reorderedNodes.length;
    var position = 100;
    for (var j = 0; j < reorderedNodes.length; j++) {
        Trello.put('/cards/' + reorderedNodes[j].value.id, {pos: '' + position}, function () {
            putCalls--;
            if (putCalls == 0) {
                showUploadDone();
            }
        });
        position += 100;
    }
}



var apiKey = false;

jQuery(document).ready(function () {

    apiKey = localStorage.getItem("sortelloTrelloDevApiKey");

    jQuery("#check_api_key").click(function () {
        saveAPIKey();
    });

    if (apiKey) {
        authenticateTrello();
    }

});

function saveAPIKey(){
    apiKey = jQuery("#api_key").val();
    localStorage.setItem('sortelloTrelloDevApiKey', apiKey);
    authenticateTrello();
}

function authenticateTrello() {
    console.log(apiKey);

    var authenticationSuccess = function (data) {
        console.log("Successful authentication");
        navigateTo("card_url_div");
    };
    var authenticationFailure = function () {
        console.log("Failed authentication");
    };
    Trello.setKey(apiKey);
    Trello.authorize({
        type: 'popup',
        name: 'Getting Started Application',
        scope: {
            read: 'true',
            write: 'true'
        },
        expiration: 'never',
        success: authenticationSuccess,
        error: authenticationFailure
    });
}

jQuery(".centered_content").each(function () {
    var content_height = jQuery(this).outerHeight();
    var viewport_height = jQuery(document).innerHeight();
    var padding_top = (viewport_height / 2) - content_height / 2;
    jQuery(this).css('padding-top', padding_top + 'px');
});

jQuery('.choice_button .card_link').click(function (e) {
    e.stopPropagation();
});
