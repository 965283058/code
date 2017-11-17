var extend = function () {
    var deep = false, index = 1, target, length = arguments.length, clone, copy;
    if (typeof arguments[0] == "boolean") {
        deep = arguments[0]
        index = 2
    }
    if (length <= index) {
        return arguments[index - 1] || {}
    }
    if (typeof arguments[index - 1] != "object") {
        target = {}
    } else {
        target = arguments[index - 1]
    }
    for (; index < length; index++) {
        if (!(clone = arguments[index])) {
            continue
        }
        for (var k in clone) {
            if (deep && typeof clone[k] == 'object') {
                copy = clone[k] instanceof Array ? [] : {}
                target[k] = extend(deep, copy, clone[k])
            } else if (typeof clone[k] != 'undefined') {
                target[k] = clone[k]
            }
        }
    }
    return target
}

