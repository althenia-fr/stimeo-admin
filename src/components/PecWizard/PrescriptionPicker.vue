<script setup>
import { computed, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {fetchAutocomplete, wizardPecForm} from "@/utils/pec-wizard.js";

const queryInput = ref('')
const suggestions = ref([])

const switchUploadMode = ref(false)
const switchFreeMode = ref(false)

function lppLabel(item){
  if(item.lppBuyOrRent==='rent') return '- LPP LOC: '+item.lppRent
  if(item.lppBuyOrRent==='buy') return '- LPP: '+item.lppBuy
  else return ''
}

const queryIsRunningDM = ref(false)
const queryIsRunningDrug = ref(false)
const queryIsRunning = computed(() => queryIsRunningDM.value || queryIsRunningDrug.value)

let controllerDM = null;
let controllerDrug = null;

async function doAutocomplete(medicalBase) {
  const query = queryInput.value.trim()
  if(!query || query.length<3) return
  try {
    let controller;
    if(medicalBase==='dm') {
      queryIsRunningDM.value= true
      if(controllerDM!=null) controllerDM.abort();
      controllerDM = new AbortController();
      controller = controllerDM;
    } else if(medicalBase==='drug') {
      queryIsRunningDrug.value= true
      if(controllerDrug!=null) controllerDrug.abort();
      controllerDrug = new AbortController();
      controller = controllerDrug;
    }

    let autocompleteResponse = await fetchAutocomplete(query,medicalBase,controller)
    for(let i=0;i<autocompleteResponse.length;i++) suggestions.value.push(autocompleteResponse[i])

    if(medicalBase==='dm') { queryIsRunningDM.value=false; controllerDM = null; }
    else if(medicalBase==='drug') { queryIsRunningDrug.value= false; controllerDrug = null; }
  } catch (err) {
    if(err.message!=='canceled') {
      hideSuggestions()
      if(medicalBase==='dm') { queryIsRunningDM.value=false; controllerDM = null; }
      else if(medicalBase==='drug') { queryIsRunningDrug.value= false; controllerDrug = null; }
      console.log(err)
    }
  }
}

function cancelAllAutocomplete() {
  if(controllerDM!=null) controllerDM.abort(); controllerDM = null;
  if(controllerDrug!=null) controllerDrug.abort(); controllerDrug = null;
  queryIsRunningDM.value=false; queryIsRunningDrug.value= false;
  suggestions.value = [];
}

let debounceTimeout = null;
function debounceAutocomplete() {
  if(!switchFreeMode.value) {
    if(debounceTimeout) clearTimeout(debounceTimeout);
    cancelAllAutocomplete();
    debounceTimeout = setTimeout(() => { doAutocomplete('dm'); doAutocomplete('drug'); }, 500)
  }
}

function deleteItem(item) {
  let labelToDelete = item.label;
  let newPrescriptionItems = [];
  for(let i=0;i<wizardPecForm.prescriptionPicker.prescriptionItems.length;i++) {
    let prescriptionItem = wizardPecForm.prescriptionPicker.prescriptionItems[i]
    if(prescriptionItem.label!==labelToDelete) newPrescriptionItems.push(prescriptionItem)
  }
  wizardPecForm.prescriptionPicker.prescriptionItems = newPrescriptionItems;
}

function pickItem(suggestion) {
  let newItem = {}
  newItem.label = suggestion.name
  newItem.qty = null
  newItem.unit = null
  newItem.comment = ''
  newItem.code = suggestion.id
  let lppBuyOrRent = null;
  if(suggestion.lppRent) lppBuyOrRent = "rent"
  else if(suggestion.lppBuy) lppBuyOrRent = "buy"
  newItem.lppBuy = suggestion.lppBuy
  newItem.lppRent = suggestion.lppRent
  newItem.lppBuyOrRent = lppBuyOrRent
  newItem.type = suggestion.type
  newItem.ald = false;
  newItem.substituable = false;

  wizardPecForm.prescriptionPicker.prescriptionItems.push(newItem);
  queryInput.value=''
  hideSuggestions()
}

function hideSuggestions() {
  setTimeout(() => { suggestions.value = [] }, 500)
}

const fileInput = ref(null);
const triggerFileInput = () => { fileInput.value.click(); };

const onFileSelected = async (event) => {
  const file = event.target.files[0];
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  wizardPecForm.prescriptionPicker.uploadPrescription = Array.from(bytes);
  wizardPecForm.prescriptionPicker.uploadFilename = file.name
};

const handleFreeInput = () => {
  if(switchFreeMode.value) {
    let freeEntry = queryInput.value.trim()
    let newItem = {}
    newItem.label = freeEntry
    newItem.qty = null
    newItem.unit = null
    newItem.comment = ''
    newItem.code = ''
    newItem.type = 'free'
    newItem.ald = false;
    newItem.substituable = false;

    wizardPecForm.prescriptionPicker.prescriptionItems.push(newItem);
    queryInput.value=''
    hideSuggestions()
  }
}

function clickSwitchUploadMode(){
  switchUploadMode.value=!switchUploadMode.value
  //raz file and prescription items
  wizardPecForm.prescriptionPicker.prescriptionItems =[]
  wizardPecForm.prescriptionPicker.uploadPrescription = []
  wizardPecForm.prescriptionPicker.uploadFilename = null

}

</script>

<template>
  <div class="prescription-container">

    <div class="section-header-flex">
      <h3 class="card-title text-primary-color">Ordonnance</h3>
      <div class="toggle-mode-wrapper">
        <span class="toggle-label text-light">Créer en ligne</span>
        <button type="button" @click="clickSwitchUploadMode" class="custom-switch-btn" :class="{ 'switch-active': switchUploadMode }">
          <span class="switch-bullet"></span>
        </button>
        <span class="toggle-label text-light">Télécharger PDF</span>
      </div>
    </div>

    <div v-if="switchUploadMode" class="upload-zone-wrapper" @click="triggerFileInput">
      <div class="file-drop-box">
        <div v-if="!wizardPecForm.prescriptionPicker.uploadFilename" class="icon-circle">
          <font-awesome-icon icon="fa-solid fa-file-arrow-up" class="upload-icon" />
        </div>
        <div v-else class="file-name-badge">
          <font-awesome-icon icon="fa-solid fa-file-pdf" />
          <span>{{ wizardPecForm.prescriptionPicker.uploadFilename }}</span>
        </div>
        <div class="upload-text">
          <p class="main-upload-p">Cliquez pour joindre l'ordonnance existante</p>
          <p class="sub-upload-p">Format accepté : PDF (max. 5Mo)</p>
        </div>
        <input type="file" ref="fileInput" class="hidden-input" @change="onFileSelected" accept=".pdf">
      </div>
    </div>

    <div v-if="!switchUploadMode" class="interactive-picker-mode">

      <div class="card-grid-3x">
        <div class="form-group">
          <label>Date de l'Ordonnance</label>
          <input type="text" v-model="wizardPecForm.prescriptionPicker.prescDate" maxlength="10" @input="onDateInput" class="form-control" placeholder="jj/mm/aaaa" />
        </div>
        <div class="form-group">
          <label>Durée de Validité</label>
          <input v-model="wizardPecForm.prescriptionPicker.validity" class="form-control" placeholder="Ex: 1 mois" />
        </div>
        <div class="form-group">
          <label>Renouvellement</label>
          <input v-model="wizardPecForm.prescriptionPicker.renewal" class="form-control" placeholder="Ex: 12 fois" />
        </div>
      </div>

      <div class="posos-search-card">
        <div class="search-input-box-relative">
          <input v-model="queryInput" @focusout="hideSuggestions" type="text" @keyup="debounceAutocomplete" @keyup.enter="handleFreeInput"
                 class="form-control custom-search-field" :class="{ 'no-icon-padding': switchFreeMode }"
                 :placeholder="switchFreeMode ? 'Saisie manuelle libre (Appuyez sur Entrée)' : 'Rechercher un dispositif médical ou médicament...'"
                 autocomplete="off">

          <div class="free-mode-toggle-inline">
            <button type="button" @click="switchFreeMode=!switchFreeMode" class="custom-switch-btn btn-xs" :class="{ 'switch-active': switchFreeMode }">
              <span class="switch-bullet"></span>
            </button>
            <span v-if="suggestions.length === 0" class="small-text-hint">Activer la saisie libre</span>
          </div>

          <ul class="posos-suggestions-dropdown" v-if="suggestions.length > 0 && !queryIsRunning">
            <li v-for="suggestion in suggestions" :key="suggestion" @click.stop="pickItem(suggestion)">
              {{ suggestion.name }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="wizardPecForm.prescriptionPicker.prescriptionItems.length > 0" class="table-container mt-4">
        <table class="stimeo-table fixed-layout-table">
          <thead>
          <tr>
            <th style="width: 28%;">Article</th>
            <th style="width: 10%; text-align: center;">Qté</th>
            <th style="width: 15%;">Unité</th>
            <th style="width: 25%;">Posologie / Commentaire</th>
            <th style="width: 12%;">LPP</th>
            <th style="width: 5%; text-align: center;">ALD</th>
            <th style="width: 5%; text-align: center;">Subst.</th>
            <th style="width: 5%;"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in wizardPecForm.prescriptionPicker.prescriptionItems" :key="item">
            <td>
              <div class="item-main-label">{{ item.label }}</div>
              <div class="item-sub-code">{{ item.type==='BRANDED_DRUG'?'CIS':'REF' }} {{ item.code }} {{ lppLabel(item) }}</div>
            </td>
            <td class="text-center">
              <input type="number" v-model="item.qty" class="form-control input-table-centered" placeholder="0"/>
            </td>
            <td>
              <select v-model="item.unit" class="form-control h-auto-select">
                <option :value=null></option>
                <option value="Boite(s)">Boite(s)</option>
                <option value="Paquet(s)">Paquet(s)</option>
                <option value="Pièce(s)">Pièce(s)</option>
              </select>
            </td>
            <td>
              <textarea rows="2" class="form-control table-textarea" placeholder="Détails, réglages..." v-model="item.comment"></textarea>
            </td>
            <td>
              <select v-model="item.lppBuyOrRent" class="form-control h-auto-select">
                <option value=""></option>
                <option value="buy" :disabled="!item.lppBuy">Achat</option>
                <option value="rent" :disabled="!item.lppRent">Location</option>
              </select>
            </td>
            <td class="text-center">
              <input type="checkbox" v-model="item.ald" class="table-checkbox">
            </td>
            <td class="text-center">
              <input type="checkbox" v-model="item.substituable" class="table-checkbox">
            </td>
            <td class="text-center">
              <button type="button" @click.stop="deleteItem(item)" class="action-btn text-danger-color">
                <font-awesome-icon icon="fa-solid fa-trash-can"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-if="queryIsRunning" class="loading-overlay-blur">
      <div class="custom-spinner-ring"></div>
    </div>

  </div>
</template>

<style scoped>
@import '@/assets/forms.css';
@import '@/assets/views.css';
@import '@/assets/card.css';

.prescription-container { position: relative; }
.section-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.text-primary-color { color: var(--stimeo-primary); }
.text-danger-color { color: var(--stimeo-danger); }
.card-grid-3x { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-bottom: 1rem; }
.fixed-layout-table { table-layout: fixed; width: 100%; }

/* Upload Box Design */
.upload-zone-wrapper { margin-top: 1rem; }
.file-drop-box {
  border: 2px dashed #cbd5e1; border-radius: 8px; padding: 2rem;
  background-color: #f8fafc; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 0.75rem; cursor: pointer; transition: border-color 0.2s;
}
.file-drop-box:hover { border-color: var(--stimeo-primary); }
.icon-circle { padding: 2rem; background: #ffffff; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.upload-icon { color: var(--stimeo-primary); font-size: 1.25rem; }
.file-name-badge { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 1rem; color: var(--stimeo-primary); }
.upload-text { text-align: center; }
.main-upload-p { font-size: 0.85rem; font-weight: 600; color: #334155; }
.sub-upload-p { font-size: 0.75rem; color: var(--stimeo-text-light); margin-top: 0.25rem; }
.hidden-input { display: none; }

/* Posos search box architecture */
.posos-search-card { background: #f8fafc; border: 1px solid var(--stimeo-border); padding: 0.75rem; border-radius: 6px; margin-top: 1rem; }
.search-input-box-relative { position: relative; }
.custom-search-field { padding-left: 2rem; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="%2394a3b8" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>'); background-repeat: no-repeat; background-position: 10px center; }
.custom-search-field.no-icon-padding { background-image: none !important; padding-left: 0.75rem !important; }
.free-mode-toggle-inline { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.4rem; }
.small-text-hint { font-size: 0.75rem; color: var(--stimeo-text-light); }

.posos-suggestions-dropdown {
  position: absolute; top: 100%; left: 0; right: 0; background: #ffffff;
  border: 1px solid var(--stimeo-border); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-height: 180px; overflow-y: auto; z-index: 250; margin-top: 4px; list-style: none; padding: 0;
}
.posos-suggestions-dropdown li { padding: 0.5rem 0.75rem; font-size: 0.8rem; cursor: pointer; color: #334155; }
.posos-suggestions-dropdown li:hover { background-color: #f1f5f9; }

/* Elements Table overrides */
.item-main-label { font-weight: 600; color: #334155; }
.item-sub-code { font-family: monospace; font-size: 0.75rem; color: var(--stimeo-text-light); margin-top: 0.15rem; }
.input-table-centered { text-align: center; padding: 0.35rem; }
.h-auto-select { height: 34px; padding: 0.2rem 0.4rem; }
.table-textarea { font-size: 0.8rem; padding: 0.4rem; resize: vertical; }
.table-checkbox { width: 16px; height: 16px; cursor: pointer; }

/* Backdrop & Spinners */
.loading-overlay-blur { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.65); backdrop-filter: blur(2px); display: flex; justify-content: center; align-items: center; z-index: 10; border-radius: 6px; }
.custom-spinner-ring { width: 32px; height: 32px; border: 3px solid #f3f3f3; border-top: 3px solid var(--stimeo-primary, #cabf75); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }


/* 1. Augmenter la zone visible du dropdown */
.posos-suggestions-dropdown {
  max-height: calc(100vh - 400px) !important; /* Ajustez la valeur 400px selon la position du champ */
  overflow-y: auto;
}


</style>