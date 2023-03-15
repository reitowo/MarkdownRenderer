import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Markdown from './Markdown.vue'
 
import "./main.css"
import "highlight.js/styles/panda-syntax-dark.css"; 

const app = createApp(App)
app.use(createRouter({
    history: createWebHistory(),
    routes: [ { path: "/", component: Markdown } ]
}))
app.mount('#app')
