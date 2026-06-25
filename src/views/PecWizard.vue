<script setup>
import {computed, ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'

import PrescriptionPicker from "@/components/PecWizard/PrescriptionPicker.vue";
import IdelOptions from "@/components/PecWizard/PecWizardIdel.vue";
import DurationAndFollowUp from "@/components/PecWizard/DurationAndFollowUp.vue";
import ProtocolTensUro2 from "@/components/PecWizard/ProtocolTensUro.vue";
import FormsForAllProtocols from "@/components/PecWizard/FormsForAllProtocols.vue";
import PecWizardPatient from "@/components/PecWizard/PecWizardPatient.vue";
import PecWizardDoctor from "@/components/PecWizard/PecWizardDoctor.vue";
import { msgModal } from '@/utils/modals/msg-modal.js';
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {checkDataPatient, checkDataDoctor, checkDataProtocol, checkDataUro, checkDataPrescription, checkDataIdel, wizardPecForm, wizardPecInitData} from "@/utils/pec-wizard.js";
import {isSaving, submitPec} from "../utils/pec-save.js";

const router = useRouter()

// --- CONFIGURATION DE L'ASSISTANT ---
const currentStep = ref(1)
const totalSteps = computed(() => {

  let count = 0;
  for(let i=0; i<stepsConfiguration.length;i++)
  {
    let stepConfiguration = stepsConfiguration[i]
    count+=stepConfiguration.substeps
  }
  return count;
})

const currentStepsConfigurationIndex = computed(() => {
  let count = 0;
  for(let i=0; i<stepsConfiguration.length;i++)
  {
    let stepConfiguration = stepsConfiguration[i]
    count+=stepConfiguration.substeps
    if(currentStep.value<=count) return i;
  }
  //default let's assume we re on the first slide
  return 0
})


const stepsConfiguration = [
   { substeps: 1, title: "Choix du patient", name:'patient', compact: true, check: checkDataPatient, needsProtocol: false },
  { substeps: 1, title: "Médecin Prescripteur", name:'doctor', compact: true, check: checkDataDoctor, needsProtocol: false  },
  { substeps: 1, title: "Ordonnance", name:'prescription', compact: false, check: checkDataPrescription, needsProtocol: false },
  { substeps: 1, title: "Protocole", name:'protocol', compact: true, check: checkDataProtocol, needsProtocol: false },
  { substeps: 7, title: "TENS Uro", name:'uro', compact: true , check: checkDataUro, needsProtocol: true},
  { substeps: 1, title: "Suivi longitudinal", name:'forms', compact: true, check: null, needsProtocol: true },
  { substeps: 1, title: "Intervention IDEL", name:'idel', compact: true, check: checkDataIdel, needsProtocol: true },

]

function startstep(name){

  let count = 0;
  for(let i=0;i<stepsConfiguration.length;i++)
  {
    let stepConfiguration = stepsConfiguration[i]
    if(stepConfiguration.name!==name)
    {
      count+=stepConfiguration.substeps
    }
    else return count + 1
  }
  //default let's assume we re on the last slide
  return 1
}

const stepName = computed(() => {
  return stepsConfiguration[currentStepsConfigurationIndex.value].name
})

const nextStepName = computed(() => {
  if(currentStepsConfigurationIndex.value>=stepsConfiguration.length-1) return stepsConfiguration[stepsConfiguration.length-1].name
  else return stepsConfiguration[currentStepsConfigurationIndex.value+1].name
})

const previousStepName = computed(() => {
  if(currentStepsConfigurationIndex.value<=0) return stepsConfiguration[0].name
  else return stepsConfiguration[currentStepsConfigurationIndex.value-1].name
})


const progressPercentage = computed(() => {
  return Math.round((currentStep.value / totalSteps.value) * 100)
})

// Refs formulaires enfants
const childPrescriptionPickerRef = ref(null);
const childDurationAndFollowUpRef = ref(null);
const childProtocolTensUroRef = ref(null);
const childFormsForAllProtocolsRef = ref(null);
const childIdelOptionsRef = ref(null);


// Navigation
function nextStep() {

  let currentStepConfiguration = stepsConfiguration[currentStepsConfigurationIndex.value]
  let check = currentStepConfiguration.check
  if(check && typeof check === 'function')
  {
    let substep = currentStep.value-startstep(currentStepConfiguration.name)+1
    let msg = check(substep)
    if(msg )
    {
      msgModal.show('Info à compléter', msg, 'OK', msgModal.defaultClose);
      return
    }
  }

 if (stepName.value === 'protocol' && wizardPecForm.protocol === 0) {

   let msg = "Comme il n'y a pas de protocole, vous êtes sur le point de sauvegarder l'Ordonnance et quitter l'assistant."
   msgModal.show('Configuration terminée', msg, 'Oui, sauvegarder', function(){msgModal.defaultClose();submitPec()}, 'Annuler',msgModal.defaultClose, true);
 }
 else if (currentStep.value < totalSteps.value) currentStep.value++;
}

function prevStep() {
  if (previousStepName.value === 'uro' && wizardPecForm.protocol !== 1) { currentStep.value = startstep('protocol'); }
  else if (currentStep.value > 1) currentStep.value--;
}

const isCompactStep = computed(
    () => {
      return stepsConfiguration[currentStepsConfigurationIndex.value].compact
    }
)

function quit(){
  msgModal.show('Attention', "Voulez-vous vraiment quitter l'assistant. Le travail en cours sera perdu.", 'Oui, quitter',function(){msgModal.defaultClose();router.back()},'Non, rester',msgModal.defaultClose,true);
}

async function fetchCreateData()
{
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    msgModal.show('Initialisation en cours', "Veuillez patienter...");
    const response = await axios.get(API_BASE_URL+'/admin/pec/create/getData',axiosRequestConfig);
    Object.assign(wizardPecInitData, response.data); //exported objects are seen as const outside the declaring file

  } catch (error) {
    console.log("error whilst fetching create pec init data", error);
  } finally {
    msgModal.defaultClose();
  }
}

onMounted(() => {
  fetchCreateData();
});


</script>

<template>
  <div class="page-container wizard-page-padding">

    <div class="page-header header-align-center" :class="{ 'centered-compact-header': isCompactStep }">
      <div class="header-titles">
        <h1 class="title">Nouvelle Prise en Charge</h1>
      </div>
      <button class="btn btn-secondary" @click="quit">Quitter</button>
    </div>

    <!-- ZONE DE L'ASSISTANT -->
    <div class="wizard-body-content">

      <div v-show="stepName === 'patient'" class="info-card centered-compact-card">

        <PecWizardPatient />

      </div>


      <!-- ÉTAPE 2 : Autorité médicale émettrice (Rédacteur supprimé) -->
      <div v-show="stepName === 'doctor'" class="info-card centered-compact-card">

        <PecWizardDoctor />

      </div>

      <div v-show="stepName === 'protocol'" class="info-card centered-compact-card step-3-clean">
        <h3 class="card-title text-primary-color">Protocole</h3>

        <div class="form-group-inline mb-4">
          <label>Protocole</label>
          <select v-model="wizardPecForm.protocol" class="form-control">
            <option :value="0">Sans protocole</option>
            <option :value="1">TENS Urologie</option>
          </select>
        </div>

        <DurationAndFollowUp v-if="wizardPecForm.protocol>0" ref="childDurationAndFollowUpRef" />

      </div>

      <!--div v-show=" 4 <= currentStep && currentStep <= 9" class="info-card centered-compact-card"-->
      <div v-show="stepName === 'uro'" class="info-card centered-compact-card">
        <ProtocolTensUro2 ref="childProtocolTensUroRef" :substep="currentStep-startstep('uro')+1" />
      </div>

      <div v-show="stepName === 'prescription'" class="info-card wide-step-overflow">
        <PrescriptionPicker ref="childPrescriptionPickerRef" />
      </div>

      <div v-show="stepName === 'forms'" class="info-card centered-compact-card">
        <FormsForAllProtocols ref="childFormsForAllProtocolsRef" />
      </div>

      <div v-show="stepName === 'idel'" class="info-card centered-compact-card step-7-clean">
        <IdelOptions ref="childIdelOptionsRef" />
      </div>

    </div>

    <!-- BARRE DE PROGRESSION ET DE NAVIGATION FIXE EN BAS DE PAGE -->
    <div class="wizard-footer-sticky">
      <div class="wizard-footer-container">

        <div class="wizard-meta-info">
          <span class="step-counter">Étape {{ currentStep }} / {{ totalSteps }}</span>
          <span class="step-label-title">{{ stepsConfiguration[currentStepsConfigurationIndex].title }}</span>
        </div>

        <div class="wizard-progress-track-wrapper">
          <div class="progress-bar-rail">
            <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>

        <div class="wizard-navigation-actions">
          <button type="button" class="btn btn-secondary" :disabled="currentStep === 1 || isSaving" @click="prevStep">
            Précédent
          </button>

          <button v-if="currentStep < totalSteps" type="button" class="btn btn-primary" @click="nextStep">
            Suivant
          </button>

          <button v-else type="button" class="btn btn-primary btn-validate-final" :disabled="isSaving" @click="submitPec">
            {{ isSaving ? 'Sauvegarde...' : 'Valider et sauvegarder' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
@import '@/assets/views.css';
@import '@/assets/card.css';
@import '@/assets/forms.css';

.wizard-page-padding { padding-bottom: 95px; }
.text-primary-color { color: var(--stimeo-primary); }

/* Alignement parfait de la ligne d'entête */
.header-align-center {
  align-items: center !important;
  margin-bottom: 1.5rem;
}

/* Cartes réduites à une demi-largeur et centrées */
.centered-compact-card {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.wide-step-overflow { overflow-x: auto; width: 100%; }


/* --- BARRE TECHNIQUE DE PIED DE PAGE FIXE --- */
.wizard-footer-sticky {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  border-top: 1px solid var(--stimeo-border);
  padding: 0.9rem 2rem;
  z-index: 99;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.05);
}
.wizard-footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.3fr 2fr 1.3fr;
  align-items: center;
  gap: 1.5rem;
}

.centered-compact-header {
  max-width: 600px;
  width: 100%;
  margin-left: auto !important;
  margin-right: auto !important;
  /* Optionnel : tu peux réduire un poil le padding horizontal pour coller aux bords de la carte */
  padding-left: 0;
  padding-right: 0;
}

.wizard-meta-info { display: flex; flex-direction: column; line-height: 1.3; }
.step-counter { font-size: 0.75rem; font-weight: 700; color: var(--stimeo-text-light); text-transform: uppercase; letter-spacing: 0.5px; }
.step-label-title { font-size: 0.95rem; font-weight: 700; color: var(--stimeo-primary); }
.progress-bar-rail { width: 100%; height: 6px; background-color: #e2e8f0; border-radius: 999px; overflow: hidden; }
.progress-bar-fill { height: 100%; background-color: var(--stimeo-primary, #cabf75); transition: width 0.25s ease-out; }
.wizard-navigation-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
.wizard-navigation-actions button { min-width: 110px; justify-content: center; }
.btn-validate-final { background-color: var(--stimeo-danger) !important; color: #ffffff; }
.btn-validate-final:disabled { opacity: 0.5; }

/* 2. Désactiver le scroll sur le parent direct s'il coupe le contenu */
.info-card.wide-step-overflow {
  overflow: visible !important;
}

</style>