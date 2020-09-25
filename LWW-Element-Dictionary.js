/*
LWW-Element-Dictionary 
map {key:value}
timeMap {key:timestamp}
removeSet {key}
*/

var LWWED = function () {
    this.map = new Map()
    this.timeMap = new Map()
    this.removeSet = new Set()
}

LWWED.prototype.add = function (key, value) {
    this.map.set(key,value)
    this.removeSet.delete(key)
    this.timeMap.set(key, new Date())
}

LWWED.prototype.remove = function (key) {
    if(this.map.has(key)) {
        this.map.delete(key)
        this.removeSet.add(key)
        this.timeMap.set(key, new Date())
    }
}

LWWED.prototype.update = function (key, value) {
    if (this.map.has(key)) {
        this.map.set(key,value)
        this.timeMap.set(key, new Date())
    }
}

LWWED.prototype.query = function (key) {
    return this.map.get(key)
}
//time O(lwwed1.map + lwwed1.removeSet + lwwed2.map + lwwed2.removeSet) 
//space O(lwwed1.map + lwwed1.removeSet + lwwed2.map + lwwed2.removeSet)
var merge = (lwwed1, lwwed2) => {
    let newLwwed = new LWWED()
    let allKeys = new Set()
    
    for(let [key, value] of lwwed1.map) {
        allKeys.add(key)
    }

    for(let [key, value] of lwwed1.removeSet) {
        allKeys.add(key)
    }

    for(let [key, value] of lwwed2.map) {
        allKeys.add(key)
    }

    for(let [key, value] of lwwed2.removeSet) {
        allKeys.add(key)
    }

    for(let key of allKeys) {
        let timestamp1;
        let timestamp2;
        //An element e is in the set if it is in A, and it is not in R with a higher timestamp: lookup(e) = ∃t,∀t′ > t : (e,t) ∈ A ∧ (e,t′) ∈/ R).
        if (lwwed1.timeMap.has(key)) {
            timestamp1 = lwwed1.timeMap.get(key)
        } else {
            if(lwwed2.map.has(key)) {
                let value = lwwed2.query(key)
                newLwwed.map.set(key,value)
            } else {
                newLwwed.removeSet.add(key)
            }
            let timeStamp = lwwed2.timeMap.get(key)
            newLwwed.timeMap.set(key,timeStamp)
            continue
        }

        if (lwwed2.timeMap.has(key)) {
            timestamp2 = lwwed2.timeMap.get(key)
        } else {
            if(lwwed1.map.has(key)) {
                let value = lwwed1.query(key)
                newLwwed.map.set(key,value)
            } else {
                newLwwed.removeSet.add(key)
            }
            let timeStamp = lwwed1.timeMap.get(key)
            newLwwed.timeMap.set(key,timeStamp)
            continue
        }
        
        if(timestamp1 > timestamp2) {
            if(lwwed1.map.has(key)) {
                let value = lwwed1.query(key)
                newLwwed.map.set(key,value)
            } else {
                newLwwed.removeSet.add(key)
            }
            newLwwed.timeMap.set(key,lwwed1.timeMap.get(key))
        } else {
            if(lwwed2.map.has(key)) {
                let value = lwwed2.query(key)
                newLwwed.map.set(key,value)
            } else {
                newLwwed.removeSet.add(key)
            }
            newLwwed.timeMap.set(key,lwwed2.timeMap.get(key))
        }
    }
    return newLwwed
}

// test
const test_AddAndQuery = () => {
    let x1 = new LWWED()
    x1.add("a",1)
    return x1.query("a") == 1
}

const test_AddAndRemove = () => {
    let x1 = new LWWED()
    x1.add("a",1)
    x1.remove("a")
    return x1.query("a") == null
}

const test_AddAndUpdate = () => {
    let x1 = new LWWED()
    x1.add("a",1)
    x1.update("a", 2)
    return x1.query("a") == 2
}

const test_onlyQuery = () => {
    let x1 = new LWWED()
    return x1.query("a") == null
}

const test_onlyUpdate = () => {
    let x1 = new LWWED()
    x1.update("a", 2)
    return x1.query("a") == null
}

const test_Merge = () => {
    let x1 = new LWWED()
    let x2 = new LWWED()

    x2.add("b",2)
    x1.update("a",0)
    x1.add("a",10)
    x1.update("a",20)

    let res = merge(x1,x2)
    
    return res.query("b") == 2 && res.query("a") == 20
}

console.log(test_AddAndQuery())
console.log(test_AddAndRemove())
console.log(test_AddAndUpdate())
console.log(test_onlyUpdate())
console.log(test_onlyQuery())
console.log(test_Merge())



