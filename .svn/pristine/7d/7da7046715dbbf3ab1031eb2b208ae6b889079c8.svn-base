<template>
    <div class="item-shadow-container cursor__pointer" :class="{'show': tiggleStatus}" ref='shadow'>
        <div class="ghost-btn-tip">{{tip}}</div>
        <span class="shadow-line line-top-left" :style="style"></span>
        <span class="shadow-line line-bottom-left" :style="style"></span>
        <span class="shadow-line line-bottom-right" :style="style"></span>
        <span class="shadow-line line-top-right" :style="style"></span>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                tiggleEle: null,
                status: false
            }
        },
        props: {
            tip: {
                type: String,
                required: true
            },
            active: {
                type: Boolean
            },
            className: {
                type: String
            },
            animation: {
                type: Object
            }
        },
        computed: {
            tiggleStatus () {
                return this.active || this.status
            },
            style () {
                return this.status ? this.animation : {}
            }
        },
        mounted () {
            this.initEle()
        },
        methods: {
            initEle () {
                this.$nextTick(() => {
                    this.tiggleEle = !this.className ? this.$refs.shadow : this.findParent(this.className)
                    this.initEvent()
                })
            },
            initEvent () {
                this.tiggleEle.addEventListener('mouseenter', () => {
                    this.status = true
                })
                this.tiggleEle.addEventListener('mouseleave', () => {
                    this.status = false
                })
            },
            findParent (className) {
                let target = this.$refs.shadow
                let classList = target.classList
                while (!classList.contains(className)) {
                    target = target.parentNode
                    classList = target.classList
                }
                return target
            }
        }
    }
</script>

<style lang="stylus">
    tip-w = 64px
    tip-h = 24px
    .item-shadow-container
        position relative
        .ghost-btn-tip
            width tip-w
            font-size 14px
            line-height tip-h
            text-align center
            color #fff
            background transparent
        .shadow-line
            position absolute
            &.line-top-left
                width 0
                height 0
                top 0
                left -2px
                transform translateY(-(tip-h + 10) px)
            &.line-bottom-left
                width 0
                height 0
                top tip-h
                left -2px
                transform translateX(-(tip-w + 10) px)
            &.line-bottom-right
                width 0
                height 0
                top 0px
                right -2px
                transform translateY((tip-h + 10)px)
            &.line-top-right
                width 0
                height 0
                top -2px
                left -2px
                transform translateX((tip-w + 10)px)
        &.show .shadow-line
            border 1px solid #fff
            transition all 0.3s
            &.line-top-left
                height (tip-h - 2)px
                transform translateY(0)
            &.line-bottom-left
                width (tip-w + 2)px
                transform translateX(0)
            &.line-bottom-right
                height (tip-h - 2)px
                transform translateY(0)
            &.line-top-right
                width (tip-w + 2)px
                transform translateX(0)
</style>
