var jsonp = function (url, callback) {
    callback = callback || 'callback'
    var id = new Date().getTime() + ((Math.random() + '').split('.').pop());
    return new Promise(function (resolve, reject) {
        window[callback + id] = function (data) {
            complete(data, null)
        }
        var script = document.createElement("script")
        if (window.addEventListener) {
            script.addEventListener("error", function (err) {
                complete(null, err)
            })
        } else {
            if (script.onerror) {
                script.attachEvent("onerror", function (e) {
                    var err = e || window.error
                    complete(null, err)
                })
            } else {
                script.onreadystatechange = function () {
                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
                        if (typeof window[callback + id] == "function") {
                            complete(null, {target: {src: url}})
                        }
                    }
                }
            }
        }
        script.src = url + (url.indexOf("?") > 0 ? "&" : "?") + callback + "=" + callback + id;
        document.getElementsByTagName("head")[0].appendChild(script)
        function complete(data, err) {
            if (!err) {
                resolve(data)
            } else {
                var error = new Error("load script [" + err.target.src + "] error")
                error.event = err
                reject(error)
            }
            script.parentNode.removeChild(script)
            try {
                delete window[callback + id]
            } catch (e) {
                window[callback + id] = null
            }
        }
    })
}
jsonp("https://qaw.houbank.com/hxd/wechat/jsapi_cfg?&url=" + encodeURIComponent('https://hxd.houbank.com/hxd/client/index.html')).then(function (data) {
    console.info(data, "succ")
}, function (err) {
    alert(err)
})