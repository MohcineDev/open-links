//how many to open at a time
const OPEN = 5
let count = 0
let links = []
const toOpen = 2
let myInter;

browser.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'runScript') {
        console.log(msg.value)
        if (msg.site === 'google')
            links = document.querySelectorAll('#rso span>a')

        else if (msg.site === 'drop')
            links = document.querySelectorAll('a.domain')


        usingInterval(links)
    } else if (msg.action === 'stopInterval') {
        sendResponse({ success: true, msg: "interval stopped!!!!" })
        stopInterval(myInter)

    }
})
console.log('Content script loaded')

///open links in new tabs
function openLinks() {

    let a = OPEN > toOpen ? toOpen : OPEN

    for (let i = 0; i < a; i++) {
        if (links[count + i] != null) {

            window.open(links[count + i])
        } 
        // else
        //     sendResponse({ success: true, msg: "link not found" })
    }
    count += a
}


function usingInterval(links) {
    openLinks()

    myInter = setInterval(() => {

        if (count >= toOpen) {
            stopInterval(myInter)
            console.log("interval stopped!!!!")
        } else {
            openLinks()
        }
    }, 10000)
}

const stopInterval = (inter) =>
    clearInterval(inter)
