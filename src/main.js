import Vue from 'vue';
import VeeValidate from 'vee-validate';
import '@fortawesome/fontawesome-free/js/all';

import 'bulma/css/bulma.css';
import './styles/app.css';
import App from './App.vue';

Vue.use(VeeValidate);

new Vue({
    render: h => h(App)
}).$mount('#app')
