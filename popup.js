const info = document.querySelector('.info')
const err = document.querySelector('.err')
const selector = document.querySelector('.selector')

let openBy = document.querySelector(".open-by .elem span");
let openIn = document.querySelector(".open-in .elem span");
const btns = document.querySelectorAll(".elem button");
btns.forEach((btn) => (btn.onclick = () => handleClick(btn)));

function handleClick(btn) {

///if open in .. seconds clicked
    if (btn.parentElement.classList.contains('seconds')) {
        let value = parseInt(openIn.textContent);
        btn.textContent == "-" ? (value -= 1) : (value += 1);
        value > 15 ? (value = 15) : value < 1 ? (value = 1) : null;
        openIn.textContent = value;
    } else {
        let value = parseInt(openBy.textContent);
        btn.textContent == "-" ? (value -= 1) : (value += 1);
        value > 10 ? (value = 10) : value < 1 ? (value = 1) : null;
        openBy.textContent = value;
    }
}

///toggle selector
document.querySelectorAll('input[type="radio"]').forEach(elem => elem.addEventListener('change', e => {
    selector.style.display = e.target.id == 'none' ? 'block' : 'none'
}))


document.querySelectorAll('.action').forEach(btn => btn.addEventListener('click', async e => {
    const cssSelector = selector.value.trim()
    ///after the open is clicked
    let openByNbr = openBy.textContent
    ///open how many links selected bu open by in  each time
    let openInSec = openIn.textContent

    const siteRadio = document.querySelector('input[type="radio"]:checked').id
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })

    if (tabs.length > 0) {
        if (e.target.id === 'runScript') {
            if (siteRadio === 'none' && cssSelector === '') {
                err.textContent = "enter css selector\n or select a site"
                hideMsg(err)
            } else {
                try {
                    const res = await browser.tabs.sendMessage(tabs[0].id, {
                        action: 'runScript', cssSelector, site: siteRadio,
                        openByNbr, openInSec
                    })
                    if (res && res.success) {
                        res.err ? (
                            err.textContent = `Open : ${res.msg} links.`,
                            hideMsg(err)
                        ) : (
                            info.textContent = `Open : ${res.msg}`,
                            hideMsg(info)
                        )
                    }
                } catch (error) {
                    err.textContent = error
                    hideMsg(err)
                    console.error('Error sending message:', error)
                }
            }
        }
        else if (e.target.id === 'stop-Interval') {
            try {
                const res = await browser.tabs.sendMessage(tabs[0].id, {
                    action: 'stopInterval'
                })
                if (res && res.success) {
                    info.textContent = res.msg
                    hideMsg(info)
                }
            } catch (error) {
                console.error('Error sending message:', error)
            }
        }
        else if (e.target.id === 'taken') {
            try {
                const res = await browser.tabs.sendMessage(tabs[0].id, {
                    action: 'open-taken'
                })
                if (res && res.success) {
                    res.err ? (
                        err.textContent = `Open : ${res.msg}`,
                        hideMsg(err)
                    ) : (

                        info.textContent = `Open : ${res.msg}`,
                        hideMsg(info)
                    )
                }
            } catch (error) {
                console.error('Error sending message:', error)
            }
        }
    }
})
)
const hideMsg = (elem) => {
    elem.classList.add('display-msg')
    setTimeout(() => {
        elem.classList.remove('display-msg')
        elem.textContent = ''
    }, 4000)
}