//how many to open at a time
const OPEN = 5
let count = 0
let links = []

browser.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'runScript') {
        console.log(msg.value)
        if (msg.site === 'google')
            links = document.querySelectorAll('#rso span>a')

        else if (msg.site === 'drop')
            links = document.querySelectorAll('a.domain')


        usingInterval(links)
    }
})
console.log('Content script loaded')

///open links in new tabs
function openLinks() {
    for (let i = 0; i < OPEN; i++) {
        if (links[count + i] != null) {

            window.open(links[count + i])
        } else
            sendResponse({ success: true, msg: "link not found" })
    }
    count += OPEN
}


function usingInterval(links) {
    openLinks()

    let myInter = setInterval(() => {

        if (count >= links.length) {
            clearInterval(myInter)
            console.log("interval stopped!!!!")
        } else {
            openLinks()
        }
    }, 30000)
}
