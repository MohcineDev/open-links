const selector = document.querySelector('.selector').value.trim()
const err = document.querySelector('.err')
const info = document.querySelector('.res')
const takenMsg = document.querySelector('.taken-msg')


document.getElementById('runScript').addEventListener('click', async () => {
    ///after the open is clicked
    const openBy = document.querySelector('#openby').value
    const siteRadio = document.querySelector('input[type="radio"]:checked').id
    console.log(siteRadio)

    if (siteRadio === 'none' && selector === '') {

        err.textContent = "enter css selector\n or select a site"
        hideMsg(err)
    } else {

        const tabs = await browser.tabs.query({ active: true, currentWindow: true })
        if (tabs.length > 0) {
            try {
                const res = await browser.tabs.sendMessage(tabs[0].id, {
                    action: 'runScript', selector, site: siteRadio,
                    openBy
                })
                if (res && res.success) {
                    err.textContent = res.message
                    hideMsg(err)
                }
            } catch (error) {
                console.error('Error sending message:', error)
            }
        }
    }
})


document.getElementById('stop-Interval').addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length > 0) {
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

})

document.getElementById('taken').addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length > 0) {
        try {
            const res = await browser.tabs.sendMessage(tabs[0].id, {
                action: 'open-taken'
            })
            if (res && res.success) {
                takenMsg.textContent += res.msg
                hideMsg(info)
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }

    }

})

const hideMsg = (elem) => {
    setTimeout(() => {
        elem.textContent = ''
    }, 5000)
}