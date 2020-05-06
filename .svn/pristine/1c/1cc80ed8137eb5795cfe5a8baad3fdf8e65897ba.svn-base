import { $ } from './util'

let time = null

export function alert (msg, showTime = 1200) {
    let exist = document.getElementsByClassName('alert-container')
    if (exist.length) {
        document.body.removeChild(exist[0])
    }
    let container = document.createElement('div'),
        classList = container.classList

    container.classList.add('alert-container')
    container.innerHTML = msg
    document.body.appendChild(container)

    /* 下一个loopEvent添加类形成过渡动画 */
    setTimeout(() => {
        classList.add('enter')
    }, 0)

    container.addEventListener('transitionend', () => {
        if (classList.contains('leave')) document.body.removeChild(container)
    })

    clearTimeout(time)

    time = setTimeout(() => {
        classList.remove('enter')
        classList.add('leave')
    }, showTime)
}

export function confirm (msg, confirm, cancel) {
    let container = document.createElement('div')
    container.classList.add('confirm-wrapper')
    container.innerHTML = `<div class="confirm-contaienr">
        <div class="confirm-title clearfix">
            <span class="confirm-tip fl">提示</span>
            <i class="fa fa-close close-btn fr"></i>
        </div>
        <div class="confirm-content">${msg}</div>
        <div class="confirm-opration clearfix">
            <span class="confirm-btn confirm-btn-cancel fr">取消</span>
            <span class="confirm-btn confirm-btn-success fr">确定</span>
        </div>
    </div>`
    document.body.appendChild(container)

    let confirmContainer = $('.confirm-contaienr', container),
        closeBtn = $('.close-btn', confirmContainer),
        confirmBtn = $('.confirm-btn-success', confirmContainer),
        cancelBtn = $('.confirm-btn-cancel', confirmContainer),
        warpperList = container.classList,
        confirmList = confirmContainer.classList

    setTimeout(() => {
        confirmList.add('enter')
    }, 0)

    container.addEventListener('click', () => {
        confirmList.remove('enter')
        confirmList.add('leave')
        warpperList.add('gone')
    })

    container.addEventListener('transitionend', () => {
        if (confirmList.contains('leave')) document.body.removeChild(container)
    })

    cancelBtn.addEventListener('click', () => {
        if (cancel && typeof cancel === 'function') cancel()
    })

    confirmBtn.addEventListener('click', () => {
        if (confirm && typeof confirm === 'function') confirm()
    })
}

export default {
    alert,
    confirm
}