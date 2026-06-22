<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">
          <font-awesome-icon @click="goBack" class="clickable" icon="fa-solid fa-arrow-left-long"/>
          Prise en Charge {{pec.patientName}}
        </h2>
        <p class="subtitle">Détails de la Prise en Charge</p>
      </div>
    </div>

    <div class="tabs-nav">
      <button :class="{ active: currentTab === 'Patient' }" @click="currentTab = 'Patient'">Patient</button>
      <button>Suivi</button>
      <button>Logisitique</button>
      <button :class="{ active: currentTab === 'Docs' }" @click="currentTab = 'Docs'">Documents</button>
      <button :class="{ active: currentTab === 'ToComplete' }" @click="currentTab = 'ToComplete'"><label>A compléter<span class="badge" v-if="toCompleteItemsCount>0">{{toCompleteItemsCount}}</span></label></button>
      <button :class="{ active: currentTab === 'Misc' }" @click="currentTab = 'Misc'">Divers</button>

    </div>

    <div class="tabs-content">
      <component v-if="pec" :is="activeTabComponent" :pec="pec"/>
    </div>

  </div>
</template>

<script setup>

import {computed, onMounted, ref} from "vue";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {API_BASE_URL} from "@/utils/http.js";
import axios from "axios";
import {storageService} from "@/utils/storage.js";
import router from "@/router/router.js";
import PecDetailsMisc from "@/components/PecDetailsTabs/PecDetailsMisc.vue";
import PecDetailsDocs from "@/components/PecDetailsTabs/PecDetailsDocs.vue";
import PatientDetailsWithinPec from "@/components/PecDetailsTabs/PecDetailsPatient.vue";
import PecDetailsToComplete from "@/components/PecDetailsTabs/PecDetailsToComplete.vue";

const currentTab = ref('Patient');
const goBack = () => router.back();

const activeTabComponent = computed(() => {
  if (currentTab.value === 'Patient') return PatientDetailsWithinPec;
  if (currentTab.value === 'Misc') return PecDetailsMisc;
  if (currentTab.value === 'Docs') return PecDetailsDocs;
  if (currentTab.value === 'ToComplete') return PecDetailsToComplete;
});

const props = defineProps({
  pecid: String,
});

const pec = ref({});

const toCompleteItemsCount = computed(()=>{
  return pec.value.billableDetails?.split(",").length;
})

const fetchPecData = async () => {
  if (pec.value.pecid) return; // Si les données existent, on ne fait rien

  //isLoading.value = true;
  try {
    const admin = storageService.getItem('admin');
    msgModal.show('Opération en cours', "Veuillez patienter...");
    const response = await axios.get(`${API_BASE_URL}/admin/pec/get?pecid=${props.pecid}`, {
      headers: { 'Authorization': 'Basic ' + admin.secret }
    });
    pec.value = response.data;
  } catch (error) {
    console.error("Erreur chargement fiche:", error);
  } finally {
    msgModal.defaultClose()
  }
};

onMounted(fetchPecData);

</script>

<style scoped>
@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/tabnav.css';
</style>