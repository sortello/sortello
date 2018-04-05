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

    getCards (externId,variable,success){
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
                console.log(data)
                success()
            });
    }

    getLists(listId, cards, success,error) {
        alert("sono in getLists")
    }

    getMembers (memberId, params, success, error) {

    }

}

export default GithubApi
