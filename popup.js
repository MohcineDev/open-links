const input = document.querySelector('.selector')
const err = document.querySelector('.err')
const res = document.querySelector('.res')

document.getElementById('runScript').addEventListener('click', async () => {
    const siteRadio = document.querySelector('input[type="radio"]:checked').id
    console.log(siteRadio)

    if (siteRadio === 'none' && input.value.trim() === '') {

        err.textContent = "enter css selector\n or select google / namedroppers"
        hideMsg(err)
    } else {

        const tabs = await browser.tabs.query({ active: true, currentWindow: true })
        if (tabs.length > 0) {
            try {
                const response = await browser.tabs.sendMessage(tabs[0].id, {
                    action: 'runScript', value: input.value, site: siteRadio
                })
                if (response && response.success) {
                    err.textContent = response.msg
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
            const response = await browser.tabs.sendMessage(tabs[0].id, {
                action: 'stopInterval'
            })
            if (response && response.success) {
                res.textContent = response.msg
                hideMsg(res)
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }

    }

})

const hideMsg = (elem) => {
    setTimeout(() => {
        elem.textContent = ''
    }, 3000)
}