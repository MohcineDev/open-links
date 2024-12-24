//how many to open at a time
const toOpen = 2
let count = 0
let links = []
let myInter;
let OPEN = 1
let stopOnGoing = false
let toWait = true

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'runScript') {
        console.log(document.querySelectorAll('#rso span>a'))
        OPEN = parseInt(msg.openByNbr)
        console.log(OPEN, parseInt(msg.openByNbr))
        if (msg.site === 'google')
            links = document.querySelectorAll('#rso span>a')

        else if (msg.site === 'drop')
            links = document.querySelectorAll('a.domain')

    } else if (msg.action === 'stopInterval') {
        sendResponse({ success: true, msg: "openning stopped!!!!" })
        stopInterval(myInter)
    } else if (msg.action == "open-taken") {
        links = document.querySelectorAll("#namecheck .taken div:nth-of-type(2) a")
        toWait = false
    }

    links.length ? (
        usingInterval(links, toWait),
        console.log("fsdddddddd"),
        sendResponse({ success: true, msg: links.length })
    ) :
        sendResponse({ success: true, msg: "link not found \n invalid selector!!" })

})
console.log('Content script loaded')

///open links in new tabs
function openLinks() {

    // let a = OPEN > toOpen ? toOpen : OPEN
    if (!stopOnGoing) {

        console.log("OPEN : ", OPEN)
        for (let i = 0; i < OPEN; i++) {

            if (links[count + i] != null) {
                console.log('open : ', links[count + i].href)
                window.open(links[count + i].href)
            }
        }
        count += OPEN
    }

}


function usingInterval(links, wait) {
    openLinks()
    let milli = wait ? 10000 : 0
    myInter = setInterval(() => {

        if (count >= links) {
            stopInterval(myInter)
            console.log("interval stopped!!!!")
        } else {
            openLinks()
        }
    }, milli)
}

const stopInterval = (inter) => {
    console.log('interval stopped')
    stopOnGoing = true
    clearInterval(inter)
}
