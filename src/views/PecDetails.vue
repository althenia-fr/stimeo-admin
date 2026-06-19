<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">
          <font-awesome-icon @click="goBack" class="clickable" icon="fa-solid fa-arrow-left-long"/>
          Pec {{pec.pecid}}
        </h2>
        <p class="subtitle">Détails de la Prise en Charge</p>
      </div>
      <button class="btn btn-primary">Enregistrer</button>
    </div>

    <div class="tabs-nav">
      <button>Devis / Bon / Facture</button>
      <button :class="{ active: currentTab === 'Locations' }" @click="currentTab = 'Locations'">Locations</button>
      <button>Document</button>
      <button>Notes</button>
      <button>Visites</button>
      <button :class="{ active: currentTab === 'Misc' }" @click="currentTab = 'Misc'">Divers</button>

    </div>

    <div class="tabs-content">
      <component :is="activeTabComponent" :pec="pec" />
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

const currentTab = ref('Locations');
const goBack = () => router.back();

const activeTabComponent = computed(() => {
  if (currentTab.value === 'Location') return PecDetailsLocation;
  if (currentTab.value === 'Misc') return PecDetailsMisc;
});

const props = defineProps({
  pecid: String,
});

const pec = ref({});

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