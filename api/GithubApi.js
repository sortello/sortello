import queryString from "query-string";

class GithubApi {

    authenticate(onAuthenticationSuccess) {
        console.log("entro in authenticate")
        let component = this;
        if(localStorage.getItem("code")===null){
            console.log("entro in authenticate con onauthenticationSuccess = null")
            window.location = "https://github.com/login/oauth/authorize?client_id="+clientId
            console.log("finito in authenticate aspetto il code")
        }else {
            console.log("entro in authenticate con onauthenticationSuccess con dentro qualcosa")
            /*const url = "https://github.com/login/oauth/access_token";
            let data = new FormData()
            data.append('client_id', clientId)
            data.append('client_secret', clientSecretId)
            data.append('code',localStorage.getItem("code"))*/
            $.getJSON('http://localhost:9999/authenticate/'+window.localStorage.getItem("code"), function(data) {
                alert(data.token);
                console.log("token restituito:"+data.token)
                localStorage.removeItem("code")
            });

            /*let post = {
                client_id: clientId,
                client_secret: clientSecretId,
                code: localStorage.getItem("code"),
                redirect_uri: "localhost:4000/app.html",
                authorize_url: 'https://github.com/login/oauth/authorize',
                access_token_url: 'https://github.com/login/oauth/access_token',
                site: 'https://github.com'
            };*/


            /*var data = qs.stringify({
                client_id: clientId, //your GitHub client_id
                client_secret: clientSecretId,  //and secret
                code: localStorage.getItem("code")   //the access code we parsed earlier
            });

            var reqOptions = {
                host: 'github.com',
                port: '443',
                path: '/login/oauth/access_token',
                method: 'POST',
                headers: { 'content-length': data.length }
            };

            var body = '';
            var req = https.request(reqOptions,{mode:"no-cors"},function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) { body += chunk; });
                res.on('end', function() {
                    alert(qs.parse(body).access_token)
                });
            });

            req.write(data);
            req.end();
            req.on('error', function(e) { alert(e.message) });*/

            /*fetch("https://github.com/login/oauth/access_token", {mode: "no-cors"}, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(post)
            })
                .then(function (response) {
                    return response.text()
                })
                .catch((error) => {
                    console.log("Error", error)
                })
                .finally(() => {
                    localStorage.removeItem("code")
                })*/
                /*.then(function(paramsString){
                    let params = new URLSearchParams(paramsString)
                    console.log('access_token', params.get('access_token'))
                })*/
        }
    }
}
    export default GithubApi

        /*var state = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            state += possible.charAt(Math.floor(Math.random() * possible.length));

        alert(text);
        if(onAuthenticationSuccess===null){
            window.location = "https://github.com/login/oauth/authorize?client_id="+clientId
        }else{
            alert("seconda volta")
        }
        /*const url = "https://github.com/login/oauth/authorize?client_id="+clientId
        fetch(url,{ mode: 'no-cors' }).then((resp) => resp.json()).then(function(data){
            alert("entered")
            const url2 = "https://github.com/login/oauth/access_token"
            let post =  {
                body: "clientId="+clientId+"&clientSecretId="+clientSecretId+"&code="+code
            }
            fetch(url2, {
                method: "post",
                body : JSON.stringify(post)
            })
            .then(json)
            .then(function(data){
                alert("ok")
            })
            .catch(function(error){
                alert("failed")
            })
        })
        .catch(function(error){
            alert(error)
        })*/
