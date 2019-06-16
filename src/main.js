import Vue from 'vue';
import VeeValidate from 'vee-validate';
import '@fortawesome/fontawesome-free/js/all';

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import './styles/app.css';
import App from './App.vue';

Vue.use(Buefy)
Vue.use(VeeValidate);

new Vue({
    render: h => h(App)
}).$mount('#app')
