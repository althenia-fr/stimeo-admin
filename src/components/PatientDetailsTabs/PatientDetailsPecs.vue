<template>
  <div class="tabs-content">

    <PecTable :uid="patientData.user?.uid" />

  </div>
</template>

<style scoped>

@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/card.css';


</style>
<script setup>


import PecTable from "@/components/PecTable.vue";
import {patientData} from "@/utils/patient.js";



</script>