<template>
    <div id="start-page">
        <div class="svg-title">
            <svg id='loading-title' version="1.1" viewBox="0 0 600 1000" xmlns="http://www.w3.org/2000/svg">
                <symbol id="text">
                    <text y="35%" class="text">Touch</text>
                    <text y="60%" class="text">Music</text>
                </symbol>
                <g>
                    <use xlink:href="#text" class="use-text"></use>
                    <use xlink:href="#text" class="use-text"></use>
                    <use xlink:href="#text" class="use-text"></use>
                    <use xlink:href="#text" class="use-text"></use>
                    <use xlink:href="#text" class="use-text"></use>
                </g>
            </svg>
        </div>
        <div class="loading-container" v-if='checked'>
            <h3 class="loading-tip" v-if='rType'><i class="loading-icon fa fa-cog fa-spin fa-lg"></i>loading resource...</h3>
            <div class='no-supprot' v-else>该浏览器不支持MP3和OGG格式的音频,请更换浏览器:)</div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapGetters } from 'vuex'
    import supportCheck from '../lib/supportCheck'
    import { STORE_NOTE_RESOURCE } from '../vuex/types'

    export default {
        data () {
            return {
                rType: '',
                checked: false,
                animated: false,
                loaded: false
            }
        },
        computed: {
            resourceUri () {
                return `http://static.journeynes.com/${this.rType}.json`
            },
            redirect () {
                return this.animated && this.loaded
            },
            ...mapGetters({
                'noteArray': 'getNoteArray'
            })
        },
        mounted () {
            if (this.noteArray.length) {
                this.$router.push({path: '/index'})
                return
            }
            /* 检测浏览器支持medie类型 */
            supportCheck((type) => {
                this.checked = true
                if (type) {
                    this.rType = type
                    this.switchAnimation()
                    this.getNoteResource()
                }
            })
        },
        methods: {
            switchAnimation () {
                setTimeout(() => {
                    this.animated = true
                }, 2500)
            },
            getNoteResource () {
                axios.get(this.resourceUri)
                    .then((response) => {
                        this.$store.commit(STORE_NOTE_RESOURCE, response.data)
                        this.loaded = true
                    })
            }
        },
        watch: {
            redirect (to) {
                if (to) this.$router.push({path: '/index'})
            }
        }
    }
</script>

<style lang='stylus'>
    #start-page
        height 100vh
        background #e8e8e8
        overflow hidden
        .svg-title
            width 80%
            margin 0 auto
        .text
            font-size 180px
            font-family Arail
        .use-text
            fill none
            stroke white
            stroke-dashoffset 35%
            stroke-dasharray 0 87.5%
            stroke-width 4px
            &:nth-child(1)
                stroke #000
                animation: animation1 2s ease-in-out forwards
            &:nth-child(2)
                stroke #333
                animation: animation2 2s ease-in-out forwards
            &:nth-child(3)
                stroke #000
                animation: animation3 2s ease-in-out forwards
            &:nth-child(4)
                stroke #666
                animation: animation4 2s ease-in-out forwards
            &:nth-child(5)
                stroke #999
                animation: animation5 2s ease-in-out forwards
        .loading-container
            position absolute
            right 100px
            bottom 40px
            .loading-tip
                font-size 18px
                text-align center
                color #333
                text-shadow 0 0 30px #333
                .loading-icon
                    margin-right 10px
            .no-supprot
                font-size 18px
                text-align center
                color #333
    #loading-title
        width 100%
        height calc(100vh - 60px)
    @keyframes animation1
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 7%
        }
    @keyframes animation2
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 14%
        }
    @keyframes animation3
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 21%
        }
    @keyframes animation4
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 28%
        }
    @keyframes animation5
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 35%
        }
</style>