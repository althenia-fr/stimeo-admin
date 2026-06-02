<template>
  <div class="page-container">

    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">Patients</h2>
        <p class="subtitle">Gestion des Patients</p>
      </div>
      <div class="search-wrapper">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon"/>
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher partout..."
            class="search-input"
        />
      </div>
      <button class="btn btn-primary" @click="patientModal.openAddModal">
        <font-awesome-icon icon="fa-solid fa-plus"/> Ajouter un Patient
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>NIR</th>
          <th>Nom</th>
          <th style="width: 15%">Prénom</th>
          <th>Date Naissance</th>
          <th style="width: 15%">Mobile</th>
          <th class="text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="isLoadingTable">
          <td colspan="6" class="empty-state">
            <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;" />
            <p>Chargement des données...</p>
          </td>
        </tr>
        <tr v-if="!isLoadingTable && filteredPatients.length === 0">
          <td colspan="6" class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>Pas de données</p>
          </td>
        </tr>
        <tr v-else v-for="(patient, index) in filteredPatients" :key="index">
          <td>{{ patient.nir }}</td>
          <td class="font-semibold">{{ patient.lastname }}</td>
          <td>{{ patient.firstname }}</td>
          <td>{{ patient.localeBirthdate }}</td>
          <td class="font-mono">{{ patient.phone }}</td>
          <td class="text-center">
            <button class="action-btn edit-btn" @click="patientModal.openEditModal(patient)" title="Modifier">
              <font-awesome-icon icon="fa-solid fa-pen"/>
            </button>
            &nbsp;
            <button class="action-btn edit-btn" @click="confirmDeleteModal(patient)" title="Effacer">
              <font-awesome-icon icon="fa-solid fa-trash-can"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <PatientModal @patient-updated="fetchPatients"/>
  </div>
</template>

<script setup>
import {patientModal} from "@/utils/modals/patient-modal.js";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import PatientModal from "@/components/PatientModal.vue";
import {ref,computed, onMounted} from "vue";

const searchQuery = ref('');
const patients = ref([]);

const filteredPatients = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return patients.value;
  return patients.value.filter(item => {
    return (
        item.lastname?.toLowerCase()?.includes(query)
        || item.firstname?.toLowerCase()?.includes(query)
        || (''+item.nir)?.toLowerCase()?.includes(query)
        || item.phone?.toLowerCase()?.includes(query)
        || item.birthdate?.toLowerCase()?.includes(query)
    );
  });
});


const isLoadingTable = ref(false);
const fetchPatients = async () => {
  isLoadingTable.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    const response = await axios.get(API_BASE_URL+'/admin/patient/get',axiosRequestConfig);

    patients.value = response.data;
  } catch (error) {
    console.log("error whilst fetching patients", error);
  } finally {
    isLoadingTable.value = false;
  }
};


const doDeletePatient = async (patient) => {

  try {
    const payload = {
      uid: patient.uid,
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
    const response = await axios.post(API_BASE_URL+'/admin/patient/delete', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      if (response.data) patients.value = response.data;
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();patientModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='DATA_EXISTS') err = "On ne peut pas effacer le Patient car il est relié à des Prises en Charges";

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();});
  }
};

function confirmDeleteModal(patient)
{
  msgModal.show('Effacer', "Voulez-vous vraiment effacer le Patient "+patient.firstname+" "+patient.lastname+"?", 'Effacer',function(){msgModal.defaultClose();doDeletePatient(patient)}, "Annuler", msgModal.defaultClose, true);
}


onMounted(() => {
  fetchPatients();
});

</script>

<style scoped>
@import '../assets/views.css';
</style>