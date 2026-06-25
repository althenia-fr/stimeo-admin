<template>

    <h3 class="card-title text-primary-color">Recherche du patient</h3>
    <div class="form-group-inline relative-position">
      <label>Patient</label>
      <div class="dropdown-wrapper-container">
        <input v-model="patientNom" @focus="showSuggest = true" @input="showSuggest = true" class="form-control" placeholder="Saisissez un nom..." />

        <div v-if="showSuggest && filteredPatients.length > 0" class="autocomplete-dropdown">
          <button type="button" v-for="p in filteredPatients" :key="p.uid" class="dropdown-item" @click="selectPatient(p)">
            <span class="font-semibold">{{ p.lastname }} {{ p.firstname }}</span>
            <span class="ref-badge">Né(e) le {{ p.localeBirthdate }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="form-group-inline mt-3" v-if="wizardPecForm.header.patientUid">
      <label>Date de naissance</label>
      <div class="form-control field-disabled-box">{{ patientDob }}</div>
    </div>


</template>

<script setup>

import {computed, ref, watch} from "vue";
import {wizardPecForm, wizardPecInitData} from "@/utils/pec-wizard.js";

const patientNom = ref('')
const patientDob = ref('')
const showSuggest = ref(false)
const filteredPatients = ref([])

let searchTimeout = null
watch(patientNom, (newName) => {
  if (!newName || newName.trim().length < 2) { filteredPatients.value = []; return; }
  if (wizardPecForm.header.patientUid && newName.includes(' ')) return; // Évite de relancer la recherche après sélection
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { performSearch(newName) }, 250)
})

function performSearch(name) {
  if (!name || name.length < 2) { filteredPatients.value = []; return; }
  const clean = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  filteredPatients.value = wizardPecInitData.patients?.filter(p => clean(p.lastname).includes(clean(name)))
}

function selectPatient(p) {
  wizardPecForm.header.patientUid = p.uid
  // Étape 1 : Ramène le prénom avec le nom dans le même champ
  patientNom.value = `${p.lastname} ${p.firstname}`
  patientDob.value = new Date(p.birthdate).toLocaleDateString('fr-FR')
  showSuggest.value = false
}

</script>

<style scoped>
@import '@/assets/views.css';
@import '@/assets/card.css';
@import '@/assets/forms.css';


</style>