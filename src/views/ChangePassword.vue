<template>
  <div>
    <img src="/stimeo_logo.png" alt="stimeo logo" width="100" style="display:block; margin: auto">
    <br/>
    <h3  style="display: block;margin:  0 auto 2rem auto;width: fit-content">Nouveau Mot de passe</h3>

    <p >Indiquez votre email afin de recevoir un lien pour choisir un nouveau mot de passe.</p>
    <br/>

    <form @submit.prevent="handleNewPassword">
      <div class="form-group">
        <label>Email</label>
        <input type="text" v-model="email" class="form-control" placeholder="moi@email.com" required />
      </div>

      <p v-html="errorMsg" class="error">
      </p>
      <button type="submit" class="btn btn-primary" style="margin: auto;display: block">Envoyer un lien</button>
    </form>

    <div class="form-footer">
      <router-link to="/login" class="link">Retour à la connexion</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {ref} from "vue";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
const router = useRouter();


const email = ref('');
const errorMsg = ref('&nbsp;');

async function handleNewPassword(){

  try {

    const payload = {
      email: email.value,
      app: "admin",
    };

    let axiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    }

    errorMsg.value = '&nbsp;'

    const response = await axios.post(API_BASE_URL + '/auth/pwdreset', payload, axiosRequestConfig);

    if (response.status === 200) {

      msgModal.show('Succès', "Le lien a été envoyé.  Vérifiez votre boite email ou les spams.", 'OK',msgModal.defaultClose);

      router.push('/login');


    }

  } catch (error) {

    let err = prettyPrintErrorMsg(error.response)
    if(err==='BAD_CREDENTIALS') err = "mauvais identifiants"
    else if(err==='USER_NOT_FOUND') err = "email inconnu"
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