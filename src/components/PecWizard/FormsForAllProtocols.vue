<script setup >
import {wizardPecForm} from "@/utils/pec-wizard.js";
import { reactive } from "vue";

/*
const form = reactive({
  patientSatisfactionEnabled: true,
  pgiIEnabled: true,
  sfQualiveenEnabled: true,
});

defineExpose({ form });

 */
</script>

<template>
  <h3 class="card-title text-primary-color">Suivi Longitudinal Transversal</h3>

  <div class="switch-list-rows mt-3">
    <div class="form-group-inline-switch">
      <span class="label-text-main">SF-Qualiveen</span>
      <div class="switch-action-side">
        <span class="side-hint-text">Non</span>
        <button type="button" @click="wizardPecForm.formsForAllProtocols.sfQualiveenEnabled = !wizardPecForm.formsForAllProtocols.sfQualiveenEnabled" class="custom-switch-btn" :class="{ 'switch-active': wizardPecForm.formsForAllProtocols.sfQualiveenEnabled }">
          <span class="switch-bullet"></span>
        </button>
        <span class="side-hint-text">Oui</span>
      </div>
    </div>

    <div class="form-group-inline-switch">
      <span class="label-text-main">Patient Global Impression of Improvement (PGI-I)</span>
      <div class="switch-action-side">
        <span class="side-hint-text">Non</span>
        <button type="button" @click="wizardPecForm.formsForAllProtocols.pgiIEnabled = !wizardPecForm.formsForAllProtocols.pgiIEnabled" class="custom-switch-btn" :class="{ 'switch-active': wizardPecForm.formsForAllProtocols.pgiIEnabled }">
          <span class="switch-bullet"></span>
        </button>
        <span class="side-hint-text">Oui</span>
      </div>
    </div>

    <div class="form-group-inline-switch">
      <span class="label-text-main">Satisfaction du patient</span>
      <div class="switch-action-side">
        <span class="side-hint-text">Non</span>
        <button type="button" @click="wizardPecForm.formsForAllProtocols.patientSatisfactionEnabled = !wizardPecForm.formsForAllProtocols.patientSatisfactionEnabled" class="custom-switch-btn" :class="{ 'switch-active': wizardPecForm.formsForAllProtocols.patientSatisfactionEnabled }">
          <span class="switch-bullet"></span>
        </button>
        <span class="side-hint-text">Oui</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/forms.css';
@import '@/assets/card.css';

.text-primary-color { color: var(--stimeo-primary); }
.form-group-inline-switch {border-bottom: 1px solid #f1f5f9; }
.form-group-inline-switch:last-child { border-bottom: none; }
.label-text-main { font-size: 0.9rem; color: #334155; font-weight: 500; }
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
</style>