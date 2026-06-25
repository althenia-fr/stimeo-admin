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
      <button class="btn btn-primary" @click="goToPecAssistant">
        <font-awesome-icon icon="fa-solid fa-plus"/> Ajouter une PEC
      </button>
    </div>


    <PecTable :search="search"/>

  </div>

</template>

<script setup>
import {ref} from 'vue';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import router from "@/router/router.js";
import PecTable from "@/components/PecTable.vue";


const goBack = () => {
  router.back()
}

const search = ref('');
const pecs = ref([])


function goToPecAssistant(){
  router.push({
    name: 'pec-assistant',
  });
}


</script>

<style scoped>
@import '../assets/views.css';

</style>