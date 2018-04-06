class GithubApi {

    authenticate (onAuthenticationSuccess) {
        let component = this;
        if (localStorage.getItem("code") === null) {
            window.location = "https://github.com/login/oauth/authorize?scope=public_repo&client_id=" + clientId;
        } else {
            $.getJSON('http://localhost:9999/authenticate/' + window.localStorage.getItem("code"), function (data) {
                localStorage.removeItem("code")
                localStorage.setItem("token", data.token)
                const url = "https://api.github.com/user?access_token=" + data.token;
                fetch(url)
                    .then((resp) => resp.json())
                    .then(function (data) {
                        localStorage.removeItem("extId")
                        localStorage.removeItem("fromExtension")
                        onAuthenticationSuccess()
                    });
            });
        }
    }

    getCardsByListId (externId, variable, success) {
        let component = this
        const uri = "https://api.github.com/projects/columns/" + externId + "/cards"
        let h = new Headers();
        h.append("Accept", "application/vnd.github.inertia-preview+json");
        h.append("Authorization", "token " + localStorage.getItem("token"));
        let url = new Request(uri, {
            method: "GET",
            headers: h
        })
        fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                let normalizedCards = component.normalizeCards();

                component.getIssues(normalizedCards).then((cards) => success(cards))

            });
    }

    normalizeCards (cards) {
        let listCards = [];
        for (let i = 0; i < cards.length; i++) {
            listCards.push({
                id: cards[i].id,
                idList: null,
                idBoard: null,
                labels: [],
                name: cards[i].note,
                pos: null,
            })
        }
        return listCards
    }

    getIssues (normalizedCards) {

        let promises = []

        for (let i = 0; i < normalizedCards.length; i++) {
            let card = normalizedCards[i]
            if (card.name === null) {
                let uri = card.content_url
                let h = new Headers();
                h.append("Accept", "application/vnd.github.inertia-preview+json");
                h.append("Authorization", "token " + localStorage.getItem("token"));
                let url = new Request(uri, {
                    method: "GET",
                    headers: h
                })
                promises.push(fetch(url)
                    .then((resp) => resp.json())
                    .then(function (data) {
                        // console.log("Data : ", data)
                        // console.log("Data.title : " + data.title)
                        card.name = data.title
                        return card
                    })
                )
            } else {
                promises.push(Promise.resolve(card))
            }
        }

        return Promise.all(promises)

    }

    getMembers (memberId, params, success, error) {
        //TODO PIU' AVANTI
    }

}

export default GithubApi
