<template>

  <div class="table-container">
    <table class="data-table">
      <thead>
      <tr>
        <th>Création</th>
        <th>Délégué</th>
        <th>Patient</th>
        <th>Prescripteur</th>
        <th>Protocole</th>
        <th>Statut</th>
        <th>A signer</th>
        <th>Caution</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="isLoadingTable">
        <td colspan="8" class="empty-state">
          <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;" />
          <p>Chargement des données...</p>
        </td>
      </tr>
      <tr v-if="!isLoadingTable && filteredPecs.length === 0">
        <td colspan="8" class="empty-state">
          <i class="fa-solid fa-users-slash"></i>
          <p>Pas de données</p>
        </td>
      </tr>
      <tr v-else v-for="(pec, index) in filteredPecs" :key="index" @click="goToPec(pec)">
        <td>{{ new Intl.DateTimeFormat('fr-FR').format(new Date(pec.createdOn)) }}</td>
        <td>{{ pec.delegateName }}</td>
        <td class="font-semibold">{{ pec.patientName }}</td>
        <td>{{ pec.doctorName }}</td>
        <td>{{ !pec.protocol?'sans':pec.protocol }} </td>
        <td @click="openModal(pec,onPecUpdateCallback)" :class="pec.protocol?'clickable':''">{{ pec.overallStatus }}</td>
        <td>{{ pec.signatureStatus }}</td>
        <td>{{ pec.depositLabel }}</td>
      </tr>
      </tbody>
    </table>
  </div>

  <IdelMgtAptModal @pec-updated="fetchPecs"/>
  <IdelMgtReviewModal @pec-updated="fetchPecs"/>


</template>
<script setup>
import {openModal} from "@/utils/idel.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import IdelMgtReviewModal from "@/components/modals/IdelMgtReviewModal.vue";
import IdelMgtAptModal from "@/components/modals/IdelMgtAptModal.vue";
import router from "@/router/router.js";
import {computed, onMounted, ref} from "vue";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";



const props = defineProps({
  uid: Number,
  search: String,
});

const goBack = () => {
  router.back()
}

const pecs = ref([])

function goToPec(pec)
{
  router.push({
    name: 'pec',
    params: { pecid: pec.pecid }
  });
}


const filteredPecs = computed(() => {
  const query = props.search?.trim().toLowerCase();
  if (!query) return pecs.value;
  return pecs.value.filter(item => {
    return (
        item.patientName?.toLowerCase().includes(query) ||
        item.doctorName?.toLowerCase().includes(query) ||
        item.protocol?.toLowerCase().includes(query) ||
        item.idelStatus?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        item.delegateName?.toLowerCase().includes(query)
    );
  });
});

const isLoadingTable = ref(false);
const fetchPecs = async () => {
  isLoadingTable.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    let url = '/admin/pec/list'
    if(props.uid) url += '?uid='+props.uid

    const response = await axios.get(API_BASE_URL+url,axiosRequestConfig);

    pecs.value = response.data;
  } catch (error) {
    console.log("error whilst fetching teams", error);
  } finally {
    isLoadingTable.value = false;
  }
};

function onPecUpdateCallback(newPecs)
{
  pecs.value = newPecs;
}


const doDeletePec = async (pec) => {

  try {
    const payload = {
      pecid: pec.pecid,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    msgModal.show('Opération en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/pec/delete', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      if (response.data) pecs.value = response.data;
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='DATA_EXISTS') err = "On ne peut pas effacer la Prise en Charge car elle a commencé à être traitée.";

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();});
  }
};



function confirmDeleteModal(pec)
{
  msgModal.show('Effacer', "Voulez-vous vraiment effacer la PEC pour "+pec.patientName+"?", 'Effacer',function(){msgModal.defaultClose();doDeletePec(pec)}, "Annuler", msgModal.defaultClose, true);
}

onMounted(() => {
  fetchPecs();
});



</script>

<style>

@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/tabnav.css';

</style>