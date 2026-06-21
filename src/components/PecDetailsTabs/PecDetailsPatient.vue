<template>
  <div class="page-container">

    <div style="border-bottom: 1px solid #ddd;margin-bottom: 20px;">
      <div style="float: right;">
        <button class="btn btn-primary" @click="savePatient">Enregistrer</button>
      </div>

      <div class="tabs-nav" style="margin-bottom: 0px !important; border-bottom: 0px solid transparent !important;">
        <button :class="{ active: currentTab === 'ID' }" @click="currentTab = 'ID'">Info. Personnelles</button>
        <button :class="{ active: currentTab === 'Payee' }" @click="currentTab = 'Payee'">Tiers-Payant</button>
        <button :class="{ active: currentTab === 'Entourage' }" @click="currentTab = 'Entourage'">Entourage</button>
      </div>

    </div>

    <div class="tabs-content">
      <component :is="activeTabComponent"  />
    </div>

  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue';
import router from "@/router/router.js";
import PatientDetailsID from "@/components/PatientDetailsTabs/PatientDetailsID.vue";
import PatientDetailsPayee from "@/components/PatientDetailsTabs/PatientDetailsPayee.vue";
import PatientDetailsEntourage from "@/components/PatientDetailsTabs/PatientDetailsEntourage.vue";
import {fetchPatientData, savePatient} from "@/utils/patient.js";


const currentTab = ref('ID');
const goBack = () => router.back();

const activeTabComponent = computed(() => {
  if (currentTab.value === 'Payee') return PatientDetailsPayee;
  if (currentTab.value === 'Entourage') return PatientDetailsEntourage;
  else return PatientDetailsID; //default

});

const props = defineProps({
  pec: Object,
});

watch(() => props.pec, async (newPec) => {
  fetchPatientData(newPec.patientUid)
});


//onMounted(function(){fetchPatientData(props.pec.patientUid)});

</script>

<style scoped>
@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/tabnav.css';
</style>