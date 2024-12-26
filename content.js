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
        OPEN = parseInt(msg.openByNbr)
        if (msg.site === 'google')
            links = document.querySelectorAll('#rso span>a')

        else if (msg.site === 'drop')
            links = document.querySelectorAll('a.domain')
        
        else if (msg.cssSelector) {
            links = document.querySelectorAll(`${msg.cssSelector}`)
        }
        ///.Nv2PK.tH5CWc.THOPZb a[data-value="Website"]
    } else if (msg.action === 'stopInterval') {
        sendResponse({ success: true, msg: "Opening Stopped!!!!" })
        stopInterval(myInter)
    } else if (msg.action == "open-taken") {
        links = document.querySelectorAll("#namecheck .taken div:nth-of-type(2) a")
        toWait = false
    }

    links.length ? (
        usingInterval(links, toWait),
        sendResponse({ success: true, msg: links.length, err: false })
    ) : (
        sendResponse({ success: true, msg: "Link not found \nOR\nInvalid Selector!!", err: true })
    )

})

///open links in new tabs
function openLinks() {

    // let a = OPEN > toOpen ? toOpen : OPEN
    if (!stopOnGoing) {

        for (let i = 0; i < OPEN; i++) {

            if (links[count + i] != null) {
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
        } else {
            openLinks()
        }
    }, milli)
}

const stopInterval = (inter) => {
    stopOnGoing = true
    clearInterval(inter)
}
