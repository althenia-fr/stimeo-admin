import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faUser, faCartPlus, faSignOut, faMagnifyingGlass, faSpinner, faUsers, faPen, faHouseMedical, faUserNurse,
} from '@fortawesome/free-solid-svg-icons'

import {faFolderOpen
} from '@fortawesome/free-regular-svg-icons'

library.add(
    faUser,faCartPlus, faSignOut,faMagnifyingGlass,faSpinner,faUsers, faPen, faHouseMedical, faUserNurse,
    faFolderOpen
)

const app = createApp(App);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
