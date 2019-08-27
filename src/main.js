import Vue from 'vue';
import Buefy from 'buefy';
import en from 'vee-validate/dist/locale/en';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { min, max, email, required } from 'vee-validate/dist/rules';
import '@fortawesome/fontawesome-free/js/all';

import 'buefy/dist/buefy.css';
import './styles/app.css';

import App from './App.vue';

extend('min', { ...min, message: en.messages['min'] });
extend('max', { ...max, message: en.messages['max'] });
extend('email', { ...email, message: en.messages['email'] });
extend('required', { ...required, message: en.messages['required'] });

Vue.use(Buefy);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

new Vue({
    render: h => h(App)
}).$mount('#app');
