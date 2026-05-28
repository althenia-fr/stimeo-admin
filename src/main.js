import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faCartPlus, faSignOut, faMagnifyingGlass, faSpinner
} from '@fortawesome/free-solid-svg-icons'

import {faUser, faFolderOpen
} from '@fortawesome/free-regular-svg-icons'

library.add(
    faUser,faSignOut,faMagnifyingGlass,faSpinner,
    faCartPlus, faFolderOpen
)

const app = createApp(App);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
