<template>
  <div class="tabs-content">

    <div class="card-grid-2x">

      <div class="info-card green-border">
        <h3 class="card-title">Sécurité Sociale <span class="required-star">*</span></h3>
        <div class="form-group-inline"><label>Num Sécu + Rang</label>

          <div class="form-row">
            <div style="flex: 2"><input type="text"  @input="(e) => { onNirInput(e) }" class="form-control" v-model="patientData.patient.nir" placeholder="N°Sécurité Sociale"/></div>
            <div style="flex: 1"><input type="text" class="form-control"  v-model="patientData.patient.rank" placeholder="rang"/></div>
          </div>

        </div>

      </div>

      <div class="info-card">
        <div class="d-flex-between">
          <h3 class="card-title">Mutuelle</h3>
        </div>

        <div class="form-group-inline"><label>N° AMC</label><input type="text" class="form-control" v-model="patientData.patient.coverComplement1"/></div>
        <div class="form-group-inline"><label>N° Adhérent</label><input type="text" class="form-control" v-model="patientData.patient.coverComplement2"/></div>
        <div class="form-group-inline"><label>Type Convention</label><input type="text" class="form-control" v-model="patientData.patient.coverComplement3"/></div>


      </div>

    </div>

  </div>
</template>

<style scoped>

@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/card.css';

/* Utilities */
.green-border { border-left: 5px solid #28a745; }
.mt-2 { margin-top: 0.5rem; }
.font-mono { font-family: monospace; letter-spacing: 1px; }
.d-flex-between { display: flex; justify-content: space-between; align-items: center; }


</style>
<script setup>
import {patientData} from "@/utils/patient.js";

function onNirInput(event) {
  const target = event.target
  if (!target) return

  let formatted = formatNir(target.value);
  target.value = formatted
  patientData.value.patient.nir = formatted
}

function formatNir(nir)
{
  if(!nir) return nir;

  let digits = nir.replace(/\D/g, '')
  if (digits.length > 15) digits = digits.slice(0, 15)
  let formatted = ''
  for (let i = 0; i < digits.length; i++) {
    formatted += digits[i]
    if ((i === 0 || i === 2 || i === 4 || i === 6 || i === 9 || i === 12) && i !== digits.length - 1) {
      formatted += ' '
    }
  }

  return formatted
}


</script>