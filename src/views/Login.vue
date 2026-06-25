<template>
  <div>
    <img src="/stimeo_logo.png" alt="stimeo logo" width="100" style="display:block; margin: auto">
    <br/>
    <h3  style="display: block;margin:  0 auto 2rem auto;width: fit-content">Connexion</h3>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Identifiant</label>
        <input type="email" placeholder="nom@stimeo.care" v-model="email"  class="form-control" required />
      </div>

      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" placeholder="••••••••" v-model="password"  class="form-control" required />
      </div>

      <p v-html="errorMsg" class="error">
      </p>

      <button type="submit" class="btn btn-primary" style="margin: auto;display: block">Se connecter</button>
    </form>

    <div class="form-footer">
      <router-link to="/change-password" class="link">Nouveau Mot de passe</router-link>
    </div>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router';
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {storageService} from "@/utils/storage.js";
import {computed, ref} from "vue";
import {goTo} from "@/router/router.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
const router = useRouter();
const route = useRoute();

const error = route.query.error;

const email = ref('');
const password = ref('');
const errorMsg = ref(error || '&nbsp;');

const handleLogin = async () => {

  try {

      const payload = {
        email: email.value,
        password: password.value,
      };

      let axiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }

      errorMsg.value = '&nbsp;'

      // 3. Appel POST Axios standard (le Content-Type passe automatiquement en application/json)
      const response = await axios.post(API_BASE_URL + '/admin/login', payload, axiosRequestConfig);

      if (response.status === 200) {

        let admin = response.data;
        storageService.setItem('admin', admin);
        goTo('/auth/catalog')

      }

  } catch (error) {

    let err = prettyPrintErrorMsg(error.response)
    if(err==='BAD_CREDENTIALS') err = "mauvais identifiants"
    errorMsg.value = err

  }

};
</script>

<style scoped>
@import '../assets/forms.css';
@import '../assets/views.css';

.error{
  color: var(--stimeo-danger);
  display: block;
  margin: -10px auto 10px auto;
  width: fit-content;
}

</style>