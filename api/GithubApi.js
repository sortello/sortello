class GithubApi {

    authenticate(onAuthenticationSuccess) {
        let component = this;
        if(localStorage.getItem("code")===null){
            window.location = "https://github.com/login/oauth/authorize?scope=public_repo&client_id="+clientId;
        }else {
            $.getJSON('http://localhost:9999/authenticate/'+window.localStorage.getItem("code"), function(data) {
                localStorage.removeItem("code")
                localStorage.setItem("token",data.token)
                const url = "https://api.github.com/user?access_token="+data.token;
                fetch(url)
                    .then((resp) => resp.json())
                    .then(function(data){
                        localStorage.removeItem("extId")
                        localStorage.removeItem("fromExtension")
                        onAuthenticationSuccess()
                    });
            });
        }
    }

    getCardsByListId (externId,variable,success){
        let component = this
        const uri = "https://api.github.com/projects/columns/"+externId+"/cards"
        let h = new Headers();
        h.append("Accept","application/vnd.github.inertia-preview+json");
        h.append("Authorization","token "+localStorage.getItem("token"));
        let url =  new Request(uri,{
            method:"GET",
            headers: h
        })
        fetch(url)
            .then((resp) => resp.json())
            .then(function(data){
                success(component.normalizeCards(data))
            });
    }

    normalizeCards(cards){
        let component = this;
        let listlabels =[];
        let title = null;
        let arrayPromise = [];
        for (var i = 0; i < cards.length; i++) {
            let data = {
                id: cards[i].id,
                idList: null,
                idBoard: null,
                labels: [],
                name: cards[i].note,
                pos: null,
            }
            if (cards[i].note === null) {
                    this.checkNote(cards[i]).then(function(title) {
                        data.name=title
                    })
            }
            listlabels.push(data)
        }
        return listlabels
    }

    checkNote(card) {
        let uri = card.content_url
        let h = new Headers();
        h.append("Accept", "application/vnd.github.inertia-preview+json");
        h.append("Authorization", "token " + localStorage.getItem("token"));
        let url = new Request(uri, {
            method: "GET",
            headers: h
        })
        return fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                console.log("Data : ",data)
                console.log("Data.title : "+data.title)
                return data.title
            }  );
    }

    getMembers (memberId, params, success, error) {
        //TODO PIU' AVANTI
    }

}

export default GithubApi
