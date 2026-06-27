<script setup>
import { ref, reactive } from 'vue'

defineProps({
  callId: Number
})

const emit = defineEmits(['close-call-sheet'])

const activeTab = ref('contexte')
const isCalling = ref(false)

function triggerPhoneCall() {
  isCalling.value = true
  setTimeout(() => { isCalling.value = false; alert("Appel virtuel terminé avec le patient."); }, 3000)
}

// --- CONTEXTE CLINIQUE DE L'APPEL SIMULÉ ---
const contextReminder = reactive({
  r3s: "R3S-99245",
  typeAppareil: "TENS Uro Stimulateur Neuromusculaire",
  noSerie: "SN-2026-X8842",
  patientName: "BERNARD Chloé",
  phone: "07 98 76 54 32",
  email: "chloe.bernard@mail.com",
  prescriber: "Dr. Jean Dupont (Clinique du Sport)",
  duration: "12 semaines",
  setupDate: "14/05/2026",
  nextApt: "15/07/2026",
  theoreticalTerm: "06/08/2026",
  examCpltaire: "Calendrier mictionnel initial à analyser"
})

const callReportForm = reactive({
  status: 'pas effectué',
  comment: '',
  followUpActionNeeded: false,
  nextCallDate: ''
})
</script>

<template>
  <div class="page-container">

    <div class="page-header header-align-center">
      <div class="header-titles">
        <h2 class="title">
          <font-awesome-icon @click="emit('close-call-sheet')" class="clickable back-arrow" icon="fa-solid fa-arrow-left-long"/>
          Fiche d'Appel : {{ contextReminder.patientName }}
        </h2>
        <p class="subtitle">Traitement en cours : {{ contextReminder.typeAppareil }}</p>
      </div>

      <button type="button" class="btn btn-call-patient" :disabled="isCalling" @click="triggerPhoneCall">
        <font-awesome-icon :icon="isCalling ? 'fa-solid fa-spinner' : 'fa-solid fa-phone-volume'" :class="{ 'fa-spin': isCalling }" />
        {{ isCalling ? 'Appel en cours...' : 'Appeler directement' }}
      </button>
    </div>

    A DEFINIR

  </div>
</template>

<style scoped>
@import '@/assets/views.css';
@import '@/assets/card.css';
@import '@/assets/forms.css';
@import '@/assets/tabnav.css';

.header-align-center { align-items: center !important; }
.back-arrow { margin-right: 0.5rem; }
.centered-compact-card { max-width: 650px; width: 100%; margin: 0 auto; }
.border-top-line { border-top: 1px solid #e2e8f0; }
.block-label { font-size: 0.85rem; font-weight: 600; color: var(--stimeo-text); display: block; }
.textarea-heavy { resize: vertical; background: #ffffff; }
.w-full { width: 100%; }
.justify-center { justify-content: center; }

.btn-call-patient { background-color: #16a34a; color: #ffffff; border: none; padding: 0.6rem 1.4rem; font-weight: 700; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.2); transition: background-color 0.2s; }
.btn-call-patient:hover:not(:disabled) { background-color: #15803d; }
.btn-call-patient:disabled { opacity: 0.6; cursor: not-allowed; }

.label-text-main { font-size: 0.85rem; color: var(--stimeo-text); }
.mini-fade { animation: fadeIn 0.25s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
</style>