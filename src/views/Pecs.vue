<template>
  <div class="page-container">

    <div class="page-header">
      <div class="header-titles">
        <h2 class="title"><font-awesome-icon @click="goBack" class="clickable" icon="fa-solid fa-arrow-left-long"/> Prises en charge</h2>
        <p class="subtitle">Gestion des Prises en charge</p>
      </div>
      <div class="search-wrapper">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon"/>
        <input
            type="text"
            v-model="search"
            placeholder="Rechercher partout..."
            class="search-input"
        />
      </div>
      <button class="btn btn-primary" @click="ctaStimeoConnect">
        <font-awesome-icon icon="fa-solid fa-plus"/> Ajouter une PEC
      </button>
    </div>


    <PecTable :search="search"/>

  </div>

</template>

<script setup>
import {computed, ref} from 'vue';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import router from "@/router/router.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import PecTable from "@/components/PecTable.vue";


const goBack = () => {
  router.back()
}

const search = ref('');
const pecs = ref([])


function ctaStimeoConnect()
{
  let msg = "Pour créer une nouvelle Prise en Charge, utilisez Stimeo Connect.<br/><br/> " +
      "Vous pouvez créer le Patient au préalable ici dans l'Admin.<br/><br/> " +
      "Eventuellement, créez-le profil IDEL ici dans l'Admin. Une invitation SMS sera envoyée à l'IDEL pour installer l'App Thérésa. " +
      "Quand vous remplirez la PEC dans Stimeo Connect, veillez bien à mettre le numéro mobile de l'IDEL pour faire le lien avec son profil."
  msgModal.show('Utilisez Stimeo Connect', msg, 'OK',msgModal.defaultClose);
}


</script>

<style scoped>
@import '../assets/views.css';

</style>