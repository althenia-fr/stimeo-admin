<template>
  <div>
    <img src="/stimeo_logo.png" alt="stimeo logo" width="100" style="display:block; margin: auto">
    <p class="subtitle">Console d'administration</p>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Identifiant</label>
        <input type="email" placeholder="nom@stimeo.care" v-model="email" required />
      </div>

      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" placeholder="••••••••" v-model="password" required />
      </div>

      <button type="submit" class="btn-primary">Se connecter</button>
    </form>

    <div class="form-footer">
      <router-link to="/change-password" class="link">Mot de passe oublié ou à modifier ?</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {storageService} from "@/utils/storage.js";
import {ref} from "vue";
import {goTo} from "@/router/router.js";
const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {

  // 2. On construit le payload JSON classique
  const payload = {
    email: email.value,
    password: password.value,
  };

  let axiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  }

  // 3. Appel POST Axios standard (le Content-Type passe automatiquement en application/json)
  const response = await axios.post(API_BASE_URL + '/admin/login', payload, axiosRequestConfig);

  if (response.status === 200) {

    let admin = response.data;
    storageService.setItem('admin', admin);
    goTo('/auth/catalog')

  }

};
</script>

<style scoped>
@import '../assets/forms.css';
</style>