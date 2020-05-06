<template>
    <div class='canvas-container' @mousedown='next($event)' ref='stage'></div>
</template>

<script>
    import SoundEngine from '../../lib/soundEngine.js'
    import Animation from '../../lib/animation.js'
    import { SHOW_NOTIFY_MSG, SWITCH_PIECE_ONOFF } from '../../vuex/types'
    import Api from '../../api/index'
    import { mapGetters } from 'vuex'

    export default {
        data () {
            return {
                index: 0,
                data: '',
                initFinished: false,
                animation: null,
                task: []
            }
        },
        computed: mapGetters({
            note: 'getNoteArray',
            pieceId: 'getPieceId',
            perform: 'getPerform',
            onOff: 'getOnOffFlag',
            noteList: 'noteList'
        }),
        mounted () {
            if (this.note.length === 0) {
                this.$router.push({path: '/'})
                return
            }
            this.init()
        },
        methods: {
            init () {
                if (!this.noteList.length) {
                    this.$store.dispatch('getPieceList')
                        .then(() => {
                            this.loadPiece()
                        })
                } else {
                    this.loadPiece()
                }
            },
            loadPiece () {
                this.$store.commit(SHOW_NOTIFY_MSG, 'loading piece...')
                Api.getNoteDetail(this.pieceId)
                    .then((response) => {
                        this.data = response.data
                        this.createScene()
                    })
            },
            createScene () {
                this.index = 0
                if (this.animation) {
                    this.animation.destroy()
                    this.animation = null
                }
                let options = {
                    ref: this.$refs.stage,
                    stage: {
                        bgColorLeft: 'e8e8e8',
                        bgColorRight: '333333'
                    },
                    textGroup: {
                        color: '#333333'
                    }
                }
                /* eslint-disable no-new */
                this.animation = new Animation(this.data, options)
                if (this.perform === 1) {
                    this.task = this.data.rhythm.map((v) => {
                        return setTimeout(() => {
                            this.next()
                        }, v * 1000)
                    })
                }
                if (!window.soundEngine) {
                    let bufferArray = this.note.slice(0, this.note.length)
                    window.soundEngine = new SoundEngine(bufferArray, () => {
                        this.initFinished = true
                    })
                } else {
                    this.initFinished = true
                }
            },
            next (event) {
                if (this.perform && event) return
                let piece = this.data.pieceData
                let volume = event ? (1 - parseFloat((event.pageY - 60) / (window.innerHeight - 60))).toFixed(2) : 1
                this.animation.next()
                window.soundEngine.playResource(piece[this.index], volume)
                this.index++
                if (this.index === piece.length) {
                    this.$store.commit(SHOW_NOTIFY_MSG, 'end')
                }
            },
            clearTask () {
                if (!this.task.length) return
                this.task.forEach((item) => {
                    clearTimeout(item)
                })
                this.task = []
            }
        },
        beforeDestroy () {
            if (this.animation) this.animation.destroy()
            if (this.perform) this.$store.commit(SWITCH_PIECE_ONOFF, 0)
            this.clearTask()
        },
        watch: {
            onOff (to, from) {
                if (to) {
                    this.$store.commit(SWITCH_PIECE_ONOFF, 0)
                    this.clearTask()
                    this.loadPiece()
                }
            },
            initFinished (to) {
                if (to) {
                    this.$store.commit(SHOW_NOTIFY_MSG, '')
                    this.initFinished = false
                }
            }
        }
    }
</script>

<style lang='stylus'>
</style>