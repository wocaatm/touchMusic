<template>
    <transition name='menu'>
        <div class="menu-container full-to-parent-wrapper" @click='close()'>
            <div class="menu-content-wrapper">
                <ul class="content-container">
                    <li class="piece-item" v-for='note in noteList'>
                        <h3 class="piece-type">{{note._id}}</h3>
                        <ul class="piece-content-ul clearfix">
                            <li class="content-item fl clearfix" v-for='piece in note.data'>
                                <p class="piece-name cursor__pointer fl">{{piece.pieceName}}</p>
                                <div class="piece-opration fl">
                                    <div class="opration-tab" @click.stop='switchPiece(piece._id, 1)'>
                                        <touch-ghost-button :active="getActiveItem(piece._id, 1)" :tip="getActiveItem(piece._id, 1) ? 'reperform': 'perform'"></touch-ghost-button>
                                    </div>
                                    <div class="opration-tab" @click.stop='switchPiece(piece._id, 0)'>
                                        <touch-ghost-button :active="getActiveItem(piece._id, 0)" :tip="getActiveItem(piece._id, 0) ? 'restart': 'play'"></touch-ghost-button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </transition>
</template>

<script>
    import touchGhostButton from '../../components/GhostButton.vue'
    import { mapGetters } from 'vuex'
    import { SWITCH_PIECE_DATA } from '../../vuex/types'

    export default {
        computed: {
            ...mapGetters({
                pieceId: 'getPieceId',
                perform: 'getPerform',
                noteList: 'noteList'
            })
        },
        mounted () {
            if (!this.noteList.length) this.$store.dispatch('getNoteList')
        },
        methods: {
            getActiveItem (pieceid, perform) {
                return this.pieceId === pieceid && this.perform === perform
            },
            switchPiece (pid, isPerform) {
                let data = {
                    pieceid: pid,
                    perform: isPerform,
                    onOff: 1
                }
                this.$store.commit(SWITCH_PIECE_DATA, data)
                this.close()
            },
            close () {
                this.$emit('closeMenu')
            }
        },
        components: {
            touchGhostButton
        }
    }
</script>

<style lang='stylus'>
    .menu-container
        z-index 10
        background rgba(0,0,0,.5)
        color #fff
        .menu-content-wrapper
            position absolute
            top 100px
            bottom 100px
            left 10%
            right 10%
            overflow hidden
            .content-container
                width calc(100% + 20px)
                height 100%
                padding-right 20px
                overflow auto
            .piece-item
                margin-top 30px
                &:first-child
                    margin-top 0
                .piece-type
                    line-height 48px
                    font-size 24px
                .piece-content-ul
                    padding-left 30px
                    .content-item
                        width 33%
                        margin-bottom 30px
                    .piece-name
                        padding-right 20px
                        line-height 24px
                        font-size 16px
                    .piece-opration
                        margin-left 10px
                    .opration-tab
                        display inline-block
                        margin-right 10px
    .menu-enter-active, .menu-leave-active
        transition all .5s ease
    .menu-enter, .menu-leave-active 
        opacity 0
</style>