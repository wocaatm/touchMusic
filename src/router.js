import Vue from 'vue'
import VueRouter from 'vue-router'

const index = resolve => {
    require.ensure(['./views/index'], () => {
        resolve(require('./views/index'))
    })
}
const start = resolve => {
    require.ensure(['./views/start'], () => {
        resolve(require('./views/start'))
    })
}

Vue.use(VueRouter)

var routers = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: start
        },
        {
            path: '/index',
            component: index
        }
    ]
})

export default routers
