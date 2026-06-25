<template>

  <h3 class="card-title text-primary-color">Médecin Prescripteur</h3>


  <div class="form-group-inline relative-position">
    <label>Médecin prescripteur</label>
    <div class="dropdown-wrapper-container">
      <input v-model="doctorName" @focus="showSuggest = true" @input="showSuggest = true" class="form-control" placeholder="Saisissez un nom..." />

      <div v-if="showSuggest && filteredDoctors.length > 0" class="autocomplete-dropdown">
        <button type="button" v-for="p in filteredDoctors" :key="p.uid" class="dropdown-item" @click="selectDoctor(p)">
          <span class="font-semibold">Dr {{ capitalizeFirstLetter(p.firstname) }} {{ capitalizeFirstLetter(p.lastname) }}</span>
        </button>
      </div>
    </div>
  </div>

  <div class="form-group-inline">
    <label>Facturation</label>
    <select v-model="wizardPecForm.header.visibleTid" class="form-control" :disabled="!wizardPecForm.header.onBehalfOf">
      <option :value="null">Choisissez l'élément de facturation...</option>
      <option v-for="opt in visibleTidOptions" :key="opt.id" :value="opt.id">
        {{ opt.name }} {{ opt.label ? ' - ' + opt.label : '' }}
      </option>
    </select>
  </div>

</template>


<script setup>

import {wizardPecForm, wizardPecInitData} from "@/utils/pec-wizard.js";
import {computed, ref, watch} from "vue";
import {capitalizeFirstLetter} from "@/utils/format.js";

const doctorName = ref('')
const doctorUId = ref(null)
const showSuggest = ref(false)
const filteredDoctors = ref([])


let searchTimeout = null
watch(doctorName, (newName) => {
  if (!newName || newName.trim().length < 2) { filteredDoctors.value = []; return; }
  if (wizardPecForm.header.onBehalfOf && newName.includes(' ')) return; // Évite de relancer la recherche après sélection
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { performSearch(newName) }, 250)
})

function performSearch(name) {
  if (!name || name.length < 2) { filteredDoctors.value = []; return; }
  const clean = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  filteredDoctors.value = wizardPecInitData.doctors?.filter(p => clean(p.lastname).includes(clean(name)))

}

function selectDoctor(d) {
  wizardPecForm.header.onBehalfOf = d.uid
  doctorName.value = `Dr ${capitalizeFirstLetter(d.firstname)} ${capitalizeFirstLetter(d.lastname)}`
  doctorUId.value = d.uid
  showSuggest.value = false
}

const visibleTidOptions = computed(() => {
  let res = []
  const doctor = wizardPecInitData.doctors?.find(d => d.uid === doctorUId.value)
  if (doctor && doctor.am) {
    res.push({ name: 'Dr '+capitalizeFirstLetter(doctor.firstname)+' '+capitalizeFirstLetter(doctor.lastname), id: 0, label: 'AM ' + doctor.am })
  }

  if(doctor && doctor.teams)
  {
    for(let i=0;i<doctor.teams.length;i++)
    {
      let team = doctor.teams[i]
      if(team.site && team.site.finess) res.push({ name: team.site.etablissement+' '+team.team.name, id: team.team.tid, label: 'FINESS ' + team.site.finess })
    }
  }

  return res
})

</script>


<style scoped>
@import '@/assets/views.css';
@import '@/assets/card.css';
@import '@/assets/forms.css';

</style>