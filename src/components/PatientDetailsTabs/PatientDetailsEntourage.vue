<template>
  <div class="tabs-content">

    <div class="card-grid-2x">

      <div class="info-card">
        <h3 class="card-title">Urgence</h3>
        <div class="form-group-inline"><label>Nom</label><input type="text" class="form-control" v-model="patientData.patient.emergencyName" /></div>
        <div class="form-group-inline"><label>Email</label><input type="text" class="form-control" v-model="patientData.patient.emergencyEmail" /></div>
        <div class="form-group-inline"><label>Tél</label><input type="text" class="form-control" v-model="patientData.patient.emergencyPhone" /></div>
        <div class="form-group-inline"><label>Relation</label><input type="text" class="form-control" v-model="patientData.patient.emergencyRelationship" /></div>
      </div>

      <div class="info-card">
        <h3 class="card-title">Aidant</h3>
        <div class="form-group-inline"><label>Nom</label><input type="text" class="form-control" v-model="patientData.patient.helperName" /></div>
        <div class="form-group-inline"><label>Email</label><input type="text" class="form-control" v-model="patientData.patient.helperEmail" /></div>
        <div class="form-group-inline"><label>Tél</label><input type="text" class="form-control" v-model="patientData.patient.helperPhone" /></div>
        <div class="form-group-inline"><label>Relation</label><input type="text" class="form-control" v-model="patientData.patient.helperRelationship" /></div>
      </div>

      <div class="info-card">
        <h3 class="card-title">Médecin Généraliste</h3>
        <div class="form-group-inline"><label>Nom</label><input type="text" class="form-control" v-model="patientData.patient.doctorName" /></div>
        <div class="form-group-inline"><label>Email</label><input type="text" class="form-control" v-model="patientData.patient.doctorEmail" /></div>
        <div class="form-group-inline"><label>Tél</label><input type="text" class="form-control" v-model="patientData.patient.doctorPhone" /></div>
        <div class="form-group-inline"><label>Ville</label><input type="text" class="form-control" v-model="patientData.patient.doctorCity" /></div>
      </div>


    </div>

  </div>
</template>

<style scoped>

@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/card.css';


</style>
<script setup>
import {patientData} from "@/utils/patient.js";
</script>