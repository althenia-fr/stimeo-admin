<template>
  <div>
    <img src="/stimeo_logo.png" alt="stimeo logo" width="100" style="display:block; margin: auto">
    <br/>
    <p style="display: block;margin:  0 auto 2rem auto;width: fit-content" >Choisissez un nouveau mot de passe.</p>

    <form @submit.prevent="changePassword">

      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" v-model="password1" class="form-control" required />
      </div>

      <div class="form-group">
        <label>Confirmation</label>
        <input type="password" v-model="password2" class="form-control" required />
      </div>

      <p v-html="errorMsg" class="error">
      </p>
      <button type="submit" class="btn btn-primary" style="margin: auto;display: block">Changer le mot de passe</button>
    </form>

    <div class="form-footer">
      <router-link to="/login" class="link">Retour à la connexion</router-link>
    </div>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router';
import {computed, ref} from "vue";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import {msgModal} from "@/utils/modals/msg-modal.js";

const route = useRoute();
const router = useRouter();

const token = computed(() => route.query.token); // "vuejs"
const email = computed(() => route.query.email);

const errorMsg = ref('&nbsp;');
const password1 = ref('')
const password2 = ref('')

async function changePassword(){

  if(!password1.value || !password2.value) return
  else if(password1.value.trim()!==password2.value.trim())
  {
    errorMsg.value = 'Le Mot de Passe et sa confirmation ne coïncident pas.'
    return
  }

  try {

    const payload = {
      token: token.value,
      email: email.value,
      password: password1.value,
      app: "admin",
    };

    let axiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    }

    errorMsg.value = '&nbsp;'

    const response = await axios.post(API_BASE_URL + '/auth/pwdedit', payload, axiosRequestConfig);

    if (response.status === 200) {

      msgModal.show('Succès', "Le Mot de Passe a été mis à jour", 'OK',msgModal.defaultClose);

      router.push('/login');


    }

  } catch (error) {

    let err = prettyPrintErrorMsg(error.response)
    if(err==='INVALID_TOKEN') err = "Le lien a expiré ou n'est pas valide"
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