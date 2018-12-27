class Service {
    static getTweets(name, count, day) {
        const host = "172.18.0.2:8000";
        return Service.loadContent(`http://${host}/${name}/${count}/${day}`);
    }
    static loadContent(url) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.responseType = "text";
        xhr.send();
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        resolve(this.responseText);
                    } else {
                        reject(`Unable to load: ${url}`);
                    }
                }
            };
        });
    }
}
