export default class soundEngine {

    constructor (bufferArray, cb) {
        this.bufferArray = bufferArray
        this.sourceArr = new Array(bufferArray.length)
        this.callback = cb
        this.init()
    }

    init () {
        try {
            global.AudioContext = global.AudioContext || global.webkitAudioContext
            this.context = new AudioContext()
        } catch (e) {
            throw new Error('web Audio API is not supported in this browser')
        }
        this.analyse()
    }

    analyse () {
        let count = 0
        this.bufferArray.forEach((v, k) => {
            this.context.decodeAudioData(v, (buffer) => {
                this.sourceArr[k] = buffer
                count++
                if (count === 88) {
                    this.bufferArray = null
                    this.callback()
                }
            })
        })
    }

    playResource (index, volume = 1) {
        if (Array.isArray(index)) {
            for (let i = 0; i < index.length; i++) {
                this.playSound(this.sourceArr[index[i]], volume)
            }
        } else {
            this.playSound(this.sourceArr[index], volume)
        }
    }

    playSound (buffer, volume) {
        let source = this.context.createBufferSource()
        let gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode()
        source.buffer = buffer
        gainNode.gain.value = volume
        source.connect(gainNode)
        gainNode.connect(this.context.destination)
        if (!source.start) source.start = source.noteOn
        source.start()
    }
}