<template>
  <div class="tabs-content">

    <div class="card-grid-2x">

      <div class="info-card green-border">
        <h3 class="card-title">Sécurité Sociale</h3>
        <div class="form-group-inline"><label>Num Sécu + Rang</label>

          <div class="form-row">
            <div style="flex: 2"><input type="text" class="form-control" v-model="patientData.patient.nir" placeholder="N°Sécurité Sociale"/></div>
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
</script>