import Vue from 'vue';
import Buefy from 'buefy';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { min, max, email, required } from 'vee-validate/dist/rules';
import '@fortawesome/fontawesome-free/js/all';

import 'buefy/dist/buefy.css';
import './styles/app.css';

import App from './App.vue';

extend('min', min);
extend('max', max);
extend('email', email);
extend('required', required);

Vue.use(Buefy);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

new Vue({
    render: h => h(App)
}).$mount('#app');
