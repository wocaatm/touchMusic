import './pixi.min'
import { assignObj, _random, plusMinus } from './util'

let quarterOfWidth = window.innerWidth * 0.25

let xDistance = (function () {
    let distance
    distance = quarterOfWidth - _random(120 + 10, 120 + 20)
    return distance
})()

let defaultConfig = {
    ref: '',
    stage: {
        width: window.innerWidth,
        height: window.innerHeight,
        bgColorLeft: 'ffffff',
        bgColorRight: '000000',
        moveSpeed: 20,
        incrementSpeed: 2.5
    },
    textGroup: {
        x: 20,
        y: 10,
        color: '#000000',
        size: 24
    },
    pop: {
        firstPopX: quarterOfWidth,
        firstPopY: window.innerHeight * 0.35,
        initRadius: 0,
        dispearFrame: 40,
        xDistance: xDistance,
        createX: 2,
        createY: 4,
        createVx: 5
    }
}

/**
 * @description {随机获取符合的pop半径}
 * @param       {Object}        option [实例的配置信息]
 * @return      {Number}               [气泡半径]
 */
function initPopRadius (option) {
    let radius, flag
    let { firstPopX, xDistance } = option.pop
    let { width } = option.stage
    while(true) {
        radius = _random(40, 120)
        for (let i = 0;;i++) {
            let stop = firstPopX + i * xDistance
            if (stop >= width / 2) break
            if ((firstPopX + i * xDistance + radius < width / 2) && (firstPopX + (i + 1) * xDistance - radius > width / 2)) {
                flag = true
                break
            }
        }
        if (flag) break
    }

    return radius
}

/**
 * @description 音符数组转换成气泡的信息数组
 * @param note 音符数组
 * @returns {Array}  [[1, 0.3],[2, 0.43]]
 */
function transformNote (note) {
    return note.map((item) => {
        let yRatio, noteCount, length = 1
        if (Array.isArray(item)) {
            noteCount = item[0]
            length = item.length
        } else {
            noteCount = item
        }
        yRatio = parseFloat((noteCount - 48) / 48).toFixed(2)

        return [length, +yRatio]
    })
}

/**
 * @description {判断坐标在canvas的哪半边} 调用要用isHalfCanvas.call()修改this
 * @param       {Number}        x [x坐标]
 * @return      {Boolean}         [返回true or false 或者颜色]
 */
function isHalfCanvas (x, color) {
    let { width, bgColorRight, bgColorLeft } = this.options.stage
    let flag = x < width / 2
    if (color) {
        if (flag) {
            return bgColorRight
        }
        return bgColorLeft
    } else {
        return flag
    }
}

/**
 * @description {{嵌套的数组转一维数组}}
 * @param       {Array}        arr           [需要转换的数组]
 * @yield       {Array}        [转化后的一维数组]
 */
function* flat (arr) {
    for (let i = 0; i < arr.length; i++) {
        var item = arr[i]
        if (Array.isArray(item)) {
            yield* flat(item)
        } else {
            yield item
        }
    }
}

/**
 * @description 在更新之前判断pop是否需要visble = false
 * @param pop
 * @returns {boolean}
 */

function checkItemPop (pop) {
    if(pop.x < 0 || pop.y < 0 || pop.alpha < 0.1 || pop.width < 1){
        return false
    }
    return true
}

export default class Animation {

    constructor (noteData, config) {
        this.pixi = global.PIXI

        this.options = assignObj(defaultConfig, config, true)

        this.options.pop.initRadius = initPopRadius(this.options)

        this.popInfoArr = transformNote(noteData.pieceData)

        this.needUpdatePopArr = []

        this.popRenfererArr = []

        this.popContainerFrame = 0

        this.lastIndex = 0

        this.lazyRenderIndex = 0

        this.index = 0

        this.switchTextFlag = false

        this.text = noteData.story

        this.textTiggerIndex = this.text.map((_, index) => {
            return index * 8 + (index ? _random(0, 6) : 0)
        })

        this.noteTexture = this.pixi.Texture.fromImage('/static/images/circlef.png')

        this.init()
    }

    init () {
        let { width, height } = this.options.stage
        //clear console
        this.pixi.utils.skipHello()
        //创建renderer autoDetectRenderer 改为CanvasRenderer
        this.renderer = new this.pixi.autoDetectRenderer(width, height)
        //canvas插入dom
        this.options.ref.appendChild(this.renderer.view)
        //初始化container
        this.initContainer()
        //初始化背景层
        this.initBg()
        //生成circle
        this.initCircle()
        //初始化 textGruop
        this.initTextGroup()
        //renderer sence
        this.renderer.render(this.stage)
        //stage update method
        this.update()
    }

    initContainer () {
        let { x, y } = this.options.textGroup
        //root Container root.destory() clear variable
        this.stage = new this.pixi.Container()

        this.bgContainer = new this.pixi.Container()

        this.stage.addChild(this.bgContainer)
        //all item Container's parent Container
        this.popContainer = new this.pixi.Container()

        this.stage.addChild(this.popContainer)

        this.textContainer = new this.pixi.Container()
        //设置textGruop的位置
        assignObj(this.textContainer, { x, y })

        this.stage.addChild(this.textContainer)
    }

    initBg () {
        let canvas, ctx, linear, sprite
        let { width, height, bgColorLeft, bgColorRight } = this.options.stage
        canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        ctx = canvas.getContext('2d')
        /* x0,y0,x1,y1 */
        linear = ctx.createLinearGradient(width / 2 - 0.1, 0, width / 2, 0)
        linear.addColorStop(0, '#' + bgColorLeft)
        linear.addColorStop(1, '#' + bgColorRight)
        ctx.fillStyle = linear
        ctx.fillRect(0, 0, width, height)
        sprite = this.pixi.Sprite.from(canvas)
        this.bgContainer.addChild(sprite)
    }

    initCircle () {
        let pops = this.popInfoArr
        let { firstPopX, xDistance } = this.options.pop

        for (let i = 0; i < pops.length; i++) {
            let item_x = firstPopX + i * xDistance
            /* 懒渲染的index */
            if (item_x > (firstPopX * (window.innerWidth / firstPopX) + 600)) {
                this.lazyRenderIndex = i
                break
            }
            /* pop[i] [count, yRatio] */
            let maxPopCount = pops[i][0] < 4 ? pops[i][0] : 3
            this.createPopGroup(item_x, pops[i][1], maxPopCount)
        }
    }

    createPopGroup (itemContainerX, yRatio, count) {
        //popGroup的分裂阶段
        let popGroup = [0]
        let tint = isHalfCanvas.call(this, itemContainerX, true)

        for (let i = 0; i< count; i++) {
            let pop = this.createPop(itemContainerX, yRatio, i, tint)
            popGroup.push(pop)
            this.popContainer.addChild(pop)
        }

        this.popRenfererArr.push(popGroup)
    }

    createPop (itemContainerX, yRatio, j, tint) {
        let pop = new this.pixi.Sprite(this.noteTexture),
            { firstPopY, initRadius } = this.options.pop,
            pY = (1 + yRatio) * firstPopY,
            radius = initRadius * (1 - j * 0.2)

        let options = {
            "x": itemContainerX,
            "y": pY + j * 0.3 * _random(5, 8) * initRadius,
            "width": radius,
            "height": radius,
            "tint": '0X' + tint
        }

        pop.anchor.set(0.5, 0.5)

        assignObj(pop, options)

        return pop
    }

    initTextGroup () {
        let { size, color } = this.options.textGroup
        this.text.forEach((value, index) => {
            let text  = new this.pixi.Text(value, { fontFamily: "微软雅黑", fontSize: size, fill: color} )
            if(index !== 0){
                text.y = - 30
                text.alpha = 0
                text.visible = false
            }
            this.textContainer.addChild(text)
        })
        this.text = null
    }

    update () {
        this.updateFrame = requestAnimationFrame(this.update.bind(this))

        if (this.index !== this.lastIndex && this.lazyRenderIndex < this.popInfoArr.length){
            this.lazyRender()
        }

        if(this.needUpdatePopArr.length){
            this.updatePop()
        }

        if(this.popContainerFrame < this.index * this.options.stage.moveSpeed){
            this.movePopContainer()
        }

        if(this.checkTigger() && this.switchTextFlag !== false){
            this.updateTextGroup()
        }

        this.renderer.render(this.stage)
    }

    lazyRender () {
        let { firstPopX, xDistance } = this.options.pop,
            index = this.lazyRenderIndex,
            pop = this.popInfoArr[index],
            item_x = firstPopX + index * xDistance,
            maxPopCount = pop[0] < 4 ? pop[0] : 3

        this.createPopGroup(item_x, pop[1], maxPopCount)
        this.lastIndex = this.index
        this.lazyRenderIndex++
    }

    updatePop () {
        let needUpdatePopArr = this.needUpdatePopArr,
            popContainer = this.popContainer,
            dispear = []

        for (let m = 0; m < needUpdatePopArr.length; m++) {
            let groupIndex = needUpdatePopArr[m]
            //具体的itemContainer
            let parents = this.popRenfererArr[groupIndex]
            //itemContainer 的pop
            let child = parents.slice(1)
            //分裂阶段
            let propogation = parents[0]

            if(propogation === 0){
                let newPop = child.map((item) => {
                    let { x, y } = item,
                        random = _random(6, 10)

                    item.destroy()
                    return Array(random).fill('').map((_, index) => {
                        let angel = _random(0, 180)
                        return this.dividePop(index, x, y, angel)
                    })
                })

                parents.length = 0
                parents.push(1)

                for (var p of flat(newPop)) {
                    popContainer.addChild(p)
                    parents.push(p)
                }

            } else {
                parents.length = 0
                parents.push(1)

                if(!child.length){
                    dispear.push(m)
                    continue
                }

                for(let j = 0; j < child.length; j++) {
                    let pop = child[j]
                    if(!checkItemPop(pop)) {
                        pop.destroy()
                        continue
                    }
                    this.updatePopArguments(pop)
                    parents.push(pop)
                }

            }
        }

        if (dispear.length > 0) {
            for (let a = 0; a < dispear.length; a++) {
                needUpdatePopArr.splice(dispear[a], 1)
            }
        }
    }

    dividePop (index, pX, pY, angel) {
        let pop = new this.pixi.Sprite(this.noteTexture)
        let { createX, createY, initRadius } = this.options.pop
        let radius = initRadius + 10 - index * _random(8, 12)
        let x = pX - createX * index * plusMinus()
        let y = pY - createY * index * Math.sin((angel / 180) * Math.PI)
        let tint = isHalfCanvas.call(this, x, true)

        let options = {
            "width": radius,
            "height": radius,
            "tint": '0X' + tint,
            "x": x,
            "y": y,
            "sin": angel,
            "sinZ": _random(1, 4) / 3,
            "vx": 5 * _random(1,4) * plusMinus()
        }

        pop.anchor.set(0.5,0.5)
        Object.assign(pop, options)

        return pop
    }

    updatePopArguments (pop) {
        let { initRadius, dispearFrame } = this.options.pop
        let pToGlobal = pop.toGlobal({x:0, y:0})
        let t = isHalfCanvas.call(this, pToGlobal.x, true)
        pop.x +=  pop.vx;
        pop.tint = '0X' + t
        pop.y +=  pop.vx * pop.sinZ * Math.sin((pop.sin / 180) * Math.PI)
        pop.alpha -= Math.random() / 30
        pop.width -= initRadius / dispearFrame
        pop.height -= initRadius / dispearFrame
        pop.sin +=3
    }

    movePopContainer () {
        let index = this.index,
            { moveSpeed, incrementSpeed } = this.options.stage,
            xDistance = this.options.pop.xDistance,
            popContainerFrame = this.popContainerFrame,
            popContainer = this.popContainer,
            popRenferer = this.popRenfererArr,
            increment = 1,
            incrementFrame = 1

        if ((index * moveSpeed - popContainerFrame) > moveSpeed * 4) {
            increment = increment * incrementSpeed
            incrementFrame = incrementFrame * incrementSpeed
        }

        this.popContainerFrame += incrementFrame
        popContainer.x += - xDistance / moveSpeed * increment

        //仅移动pop的更新
        for (let s = index; s < this.lazyRenderIndex; s++) {
            let child = popRenferer[s].slice(1)
            let pToGlobal = child[0].toGlobal({ x:0, y:0 })
            let t = isHalfCanvas.call(this, pToGlobal.x, true)
            child.forEach(item => {
                item.tint = '0X' + t
            })
        }
    }

    checkTigger () {
        if (this.switchTextFlag) return true

        let index = this.index,
            tiggerArr = this.textTiggerIndex

        let tigger = tiggerArr.indexOf(index)
        if (tigger !== -1 && index !== 0) {
            this.switchTextFlag = this.textContainer.children.findIndex((v) => {
                return v.visible === true
            })
            tiggerArr.splice(tigger, 1)
        }

        return true
    }

    updateTextGroup () {
        let textChild = this.textContainer.children,
            visibleIndex = this.switchTextFlag,
            now = textChild[visibleIndex],
            next = textChild[visibleIndex + 1]

        now.y += -3
        now.alpha = (now.alpha * 100 - 10) / 100
        if (!next.visible) next.visible = true
        next.y += 1.5
        next.alpha = (next.alpha * 100 + 5) / 100

        if (next.alpha === 1) {
            now.visible = false
            this.switchTextFlag = false
        }
    }

    next () {
        this.needUpdatePopArr.push(this.index++)
    }

    destroy () {
        cancelAnimationFrame(this.updateFrame)
        this.updateFrame = null
        this.renderer.destroy(true)
    }
}
