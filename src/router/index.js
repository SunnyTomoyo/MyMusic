import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home'
import Video from '@/components/pages/Video'
import VideoD from '@/components/pages/VideoD'
import Singer from '@/components/pages/Singer'
import SongChart from '@/components/pages/SongChart'
import Search from '@/components/pages/Search'
import SearchRes from '@/components/pages/SearchRes'
import Main from '@/components/pages/Main'
import Friend from '@/components/pages/Friend'
import Login from '@/components/pages/Login'
import MyselfSongList from '@/components/pages/MyselfSongList'
import MyEvent from '@/components/pages/MyEvent'
import Myself from '@/components/pages/Myself'
import LoginForm from '@/components/pages/LoginForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/songlist',
      component: SongChart,
      name: 'SongChart'
    },
    {
      path: '/login',
      component: Login,
      children: [{
        path: 'loginForm',
        component: LoginForm
      }]
    },
    {
      path: '/search',
      component: Search,
      children: [{
        path: 'word',
        component: SearchRes,
        name: 'SearchRes'
      }]
    },
    {
      path: '/main',
      component: Main
    },
    {
      path: '/friend',
      component: Friend
    },
    {
      path: '/video',
      component: Video,
      children: [{
        path: 'details',
        component: VideoD
      }]
    },
    {
      path: '/myself',
      component: Myself,
      children: [{
        path: '',
        components: {
          music: MyselfSongList,
          share: MyEvent
        }
      }]
    },
    {
      path: '/singer',
      component: Singer,
    }
  ]
})
