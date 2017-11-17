var jsonp = function (url, callback) { //参数为请求的URL地址，服务器生成的回调函数的名称（默认为callback）
    callback = callback || 'callback'
    var id = new Date().getTime() + ((Math.random() + '').split('.').pop());//为回调函数添加随机ID
    return new Promise(function (resolve, reject) {
        window[callback + id] = function (data) {
            complete(data, null)
        }
        var script = document.createElement("script")
        if (window.addEventListener) {
            script.addEventListener("error", function (err) { //如果是webkt内核的JSON请求出错，调用complete
                complete(null, err)
            })
        } else {
            if (script.onerror) {
                script.attachEvent("onerror", function (e) {
                    var err = e || window.error
                    complete(null, err)
                })
            } else {
                script.onreadystatechange = function () { //IE6-8 Opera 不支持srcipt的onerrer事件，但是script会先执行加载的代码，再触发onreadystatechange事件，利用complete函数是否执行来归结错误
                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
                        if (typeof window[callback + id] == "function") {
                            complete(null, {target: {src: url}})
                        }
                    }
                }
            }
        }
        script.src = url + (url.indexOf("?") > 0 ? "&" : "?") + callback + "=" + callback + id;//为url添加回调函数名
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
                delete window[callback + id] //部分浏览器删除会Window上属性会有错误
            } catch (e) {
                window[callback + id] = null
            }
        }
    })
}
