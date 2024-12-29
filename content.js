//how many to open at a time
const toOpen = 2
let count = 0
let OPEN = 1
let stopOpening = false
let toWait = true

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    count = 0
    let links = []
    stopOpening = false
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
        stopInterval()
    } else if (msg.action == "open-taken") {
        links = document.querySelectorAll("#namecheck .taken div:nth-of-type(2) a")
        console.log(links)
        toWait = false
        console.log("taken clicked")
    }

    links.length ? (
        usingInterval(links, toWait),
        sendResponse({ success: true, msg: links.length, err: false })
    ) : (
        sendResponse({ success: true, msg: "Link not found \nOR\nInvalid Selector!!", err: true })
    )

})

///open links in new tabs
function openLinks(links) {

    // let a = OPEN > toOpen ? toOpen : OPEN
    if (!stopOpening) {
        console.log(count)
        for (let i = 0; i < OPEN; i++) {

            if (links[count + i] != null) {
                window.open(links[count + i].href)

            }
        }
        count += OPEN
    } else {
        console.log("hi")
    }
}

function usingInterval(links, wait) {
    let myInter = null;

    openLinks(links)
    console.log(links.length)
    let milli = wait ? 10000 : 0
    myInter = setInterval(() => {
        if (count >= links.length || stopOpening) {
            stopInterval(myInter)
        } else {
            openLinks(links)
        }
    }, milli)
}

const stopInterval = (myInter) => {
    stopOpening = true
    clearInterval(myInter)
    myInter = null
}
