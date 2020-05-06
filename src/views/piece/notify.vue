<template>
    <div class="notify-container" v-if='notifyMessage.length'>
        <div class="notify-message">
            <div v-if="notifyMessage === 'end'">
                <span class='notify-item' @click='opration(0)'>{{perform ? 'perform' : 'play'}} again</span>or<span class='notify-item' @click='opration(1)'>choose piece</span>
            </div>
            <p v-else>{{notifyMessage}}</p>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { SWITCH_PIECE_ONOFF, SHOW_NOTIFY_MSG } from '../../vuex/types'

    export default {
        computed: mapGetters({
            notifyMessage: 'getNotify',
            perform: 'getPerform'
        }),
        methods: {
            opration (type) {
                this.$store.commit(SHOW_NOTIFY_MSG, '')
                if (type) {
                    this.$emit('openMenu')
                } else {
                    this.$store.commit(SWITCH_PIECE_ONOFF, 1)
                }
            }
        }
    }
</script>

<style lang='stylus'>
    .notify-container
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        z-index 11
        background rgba(0,0,0,.2)
        .notify-message
            position absolute
            top 50%
            left 50%
            padding 40px 60px
            text-align center
            background rgba(99,99,99,.8)
            font-size 20px
            font-family Arial
            font-weight bold
            color #fff
            transform translate(-50%,-50%)
            .notify-item
                display inline-block
                margin 0 20px
                padding 2px 0
                cursor pointer
                border-bottom 2px solid #fff
</style>