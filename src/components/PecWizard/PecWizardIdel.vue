<script setup>
import { computed, watch } from "vue";
import {wizardPecForm} from "@/utils/pec-wizard.js";

watch(() => wizardPecForm.idelOptions.idelKnown, (v) => {
  if (v !== true) {
    wizardPecForm.idelOptions.idelNurseName = ''
    wizardPecForm.idelOptions.idelNurseCity = ''
  }
  if (v !== false) wizardPecForm.idelOptions.stimeoMayCaterFor = false
})

const DAYS_OPTIONS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

const availabilityOptions = computed(() => {
  return [
    {label: `Toute la journée`, value: 'Toute la journée'},
    {label: `Matin`, value: 'Matin'},
    {label: `Après-midi`, value: 'Après-midi'},
    {label: `Soirée`, value: 'Soir'},
  ]
})

function applyAlailableOn(p) {
  const found = availabilityOptions.value.find(o => o.value === p)
  if (!found) return
  wizardPecForm.idelOptions.patientAvailableOn.timeslot = p
}

function toggleAutoriseCoordination() {
  if (wizardPecForm.idelOptions.idelKnown !== false) return
  wizardPecForm.idelOptions.stimeoMayCaterFor = !wizardPecForm.idelOptions.stimeoMayCaterFor
}
</script>

<template>
  <h3 class="card-title text-primary-color">Intervention IDEL</h3>

  <div class="form-group-inline-switch padding-y">
    <span class="label-text-main">Le patient a-t-il besoin d'une éducation à domicile ?</span>
    <div class="switch-action-side">
      <span class="side-hint-text">Non</span>
      <button type="button" @click="wizardPecForm.idelOptions.idelNeeded = !wizardPecForm.idelOptions.idelNeeded" class="custom-switch-btn" :class="{ 'switch-active': wizardPecForm.idelOptions.idelNeeded }">
        <span class="switch-bullet"></span>
      </button>
      <span class="side-hint-text">Oui</span>
    </div>
  </div>

  <div v-if="wizardPecForm.idelOptions.idelNeeded === true" class="idel-conditional-wrapper mt-3">

    <div class="form-group-inline-switch padding-y border-none">
      <span class="label-text-main">Le patient a-t-il un(e) IDEL identifié(e) ?</span>
      <div class="switch-action-side">
        <span class="side-hint-text">Non</span>
        <button type="button" @click="wizardPecForm.idelOptions.idelKnown = !wizardPecForm.idelOptions.idelKnown" class="custom-switch-btn" :class="{ 'switch-active': wizardPecForm.idelOptions.idelKnown }">
          <span class="switch-bullet"></span>
        </button>
        <span class="side-hint-text">Oui</span>
      </div>
    </div>

    <div v-if="!wizardPecForm.idelOptions.idelKnown" class="coordination-notice-box mt-2">
      <div class="flex-notice-row">
        <button type="button" @click="toggleAutoriseCoordination" class="custom-switch-btn" :class="{ 'switch-active': wizardPecForm.idelOptions.stimeoMayCaterFor && !wizardPecForm.idelOptions.idelKnown }">
          <span class="switch-bullet"></span>
        </button>
        <span class="notice-text-content">Le patient autorise STIMEO à coordonner la prise en charge par un(e) IDEL.</span>
      </div>
    </div>

    <div v-if="wizardPecForm.idelOptions.idelKnown" class="idel-fields-stack mt-3">
      <div class="form-group-inline">
        <label>Nom IDEL</label>
        <input v-model="wizardPecForm.idelOptions.idelNurseName" class="form-control" placeholder="Nom de l'infirmier(e)" />
      </div>
      <div class="form-group-inline">
        <label>Ville</label>
        <input v-model="wizardPecForm.idelOptions.idelNurseCity" class="form-control" placeholder="Ville d'exercice" />
      </div>
      <div class="form-group-inline">
        <label>N° Mobile IDEL</label>
        <input v-model="wizardPecForm.idelOptions.idelNursePhone" class="form-control" placeholder="Téléphone portable" />
      </div>
      <div class="form-group-inline">
        <label>Email IDEL</label>
        <input v-model="wizardPecForm.idelOptions.idelNurseEmail" class="form-control" placeholder="adresse@mail.com" />
      </div>
    </div>

    <div class="availabilities-block mt-4 border-top-line pt-3" v-if="wizardPecForm.idelOptions.idelKnown || wizardPecForm.idelOptions.stimeoMayCaterFor">
      <label class="section-micro-title-gold">Disponibilités <span class="required-star">*</span></label>

      <div class="checkbox-row-flex mt-2 mb-3">
        <label v-for="day in DAYS_OPTIONS" :key="day" class="checkbox-inline-label">
          <input type="checkbox" :checked="wizardPecForm.idelOptions.patientAvailableOn.days.includes(day)"
                 @change="(e) => {
                    const checked = e.target.checked
                    if (checked && !wizardPecForm.idelOptions.patientAvailableOn.days.includes(day)) {
                      wizardPecForm.idelOptions.patientAvailableOn.days.push(day)
                    } else if (!checked) {
                      const idx = wizardPecForm.idelOptions.patientAvailableOn.days.indexOf(day)
                      if (idx > -1) { wizardPecForm.idelOptions.patientAvailableOn.days.splice(idx, 1) }
                    }
                 }" class="native-form-checkbox" />
          <span class="day-text">{{ day }}</span>
        </label>
      </div>

      <div class="form-group-inline">
        <label>Créneau préférentiel</label>
        <select class="form-control" v-model="wizardPecForm.idelOptions.patientAvailableOn.timeslot" @change="applyAlailableOn(wizardPecForm.idelOptions.patientAvailableOn.timeslot)">
          <option v-for="opt in availabilityOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div class="form-group-inline mt-1">
        <label></label> <span class="micro-hint-info">L'heure de passage précise sera à définir directement par l'IDEL</span>
      </div>

      <div class="form-group mt-4 border-top-line-soft pt-3">
        <label class="mb-1 block font-semibold text-xs">Note d'information pour l'IDEL</label>
        <textarea v-model="wizardPecForm.idelOptions.idelNoteFromDoctor" rows="2" class="form-control table-textarea" placeholder="Consignes particulières..."></textarea>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import '@/assets/forms.css';
@import '@/assets/card.css';

.text-primary-color { color: var(--stimeo-primary); }
.required-star { color: var(--stimeo-danger); }
.padding-y { padding: 0.5rem 0; }
.border-none { border-bottom: none !important; }
.label-text-main { font-size: 0.95rem; color: #334155; font-weight: 500; }
.switch-action-side { display: flex; align-items: center; gap: 0.4rem; }
.side-hint-text { font-size: 0.75rem; color: var(--stimeo-text-light); }

.custom-switch-btn {
  width: 36px; height: 20px; background-color: #cbd5e1; border-radius: 9999px;
  position: relative; border: none; cursor: pointer; transition: background-color 0.2s;
}
.custom-switch-btn.switch-active { background-color: var(--stimeo-primary, #cabf75); }
.switch-bullet {
  width: 14px; height: 14px; background-color: #ffffff; border-radius: 50%;
  position: absolute; top: 3px; left: 3px; transition: transform 0.2s;
}
.custom-switch-btn.switch-active .switch-bullet { transform: translateX(16px); }

.coordination-notice-box { background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 0.65rem 0.85rem; }
.flex-notice-row { display: flex; align-items: center; gap: 0.75rem; }
.notice-text-content { font-size: 0.85rem; color: #92400e; font-weight: 600; }

.idel-conditional-wrapper { background: #f8fafc; border: 1px solid var(--stimeo-border); padding: 0.85rem; border-radius: 6px; }
.idel-fields-stack { display: flex; flex-direction: column; gap: 0.2rem; }
.border-top-line { border-top: 1px solid #e2e8f0; }
.border-top-line-soft { border-top: 1px solid #f1f5f9; }
.section-micro-title-gold { font-size: 0.8rem; font-weight: 700; color: var(--stimeo-primary); text-transform: uppercase; letter-spacing: 0.3px; display: block; }

.checkbox-row-flex { display: flex; flex-wrap: wrap; gap: 1rem; }
.checkbox-inline-label { display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer; }
.native-form-checkbox { width: 15px; height: 15px; cursor: pointer; }
.day-text { font-size: 0.85rem; color: #475569; font-weight: 500; }
.micro-hint-info { display: block; font-size: 0.75rem; color: var(--stimeo-text-light); font-style: italic; }
.table-textarea { resize: vertical; font-size: 0.85rem; }
</style>