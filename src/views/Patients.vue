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
            v-model="search"
            placeholder="Rechercher partout..."
            class="search-input"
        />
      </div>
      <button class="btn btn-primary" @click="function(){goToPatient(null)}">
        <font-awesome-icon icon="fa-solid fa-plus"/> Ajouter un Patient
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>NIR</th>
          <th>Nom</th>
          <th>Né(e) le</th>
          <th style="width: 15%">Mobile</th>
          <th >Email</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="isLoadingTable">
          <td colspan="5" class="empty-state">
            <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;" />
            <p>Chargement des données...</p>
          </td>
        </tr>
        <tr v-if="!isLoadingTable && filteredPatients.length === 0">
          <td colspan="5" class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>Pas de données</p>
          </td>
        </tr>
        <tr v-else v-for="(patient, index) in filteredPatients" :key="index" @click="goToPatient(patient)">
          <td>{{ patient.nir }}</td>
          <td class="font-semibold">{{ patient.lastname }} {{ patient.firstname }}</td>
          <td>{{ patient.localeBirthdate }}</td>
          <td>{{ patient.phone }}</td>
          <td>{{ patient.email }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!--PatientModal @patient-updated="fetchPatients"/-->
  </div>
</template>

<script setup>
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {ref,computed, onMounted} from "vue";
import router from "@/router/router.js";

const goBack = () => {
  router.back()
}


const search = ref('');
const patients = ref([]);

const filteredPatients = computed(() => {
  const query = search.value.trim().toLowerCase();
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
    const response = await axios.get(API_BASE_URL+'/admin/patient/list',axiosRequestConfig);

    patients.value = response.data;
  } catch (error) {
    console.log("error whilst fetching patients", error);
  } finally {
    isLoadingTable.value = false;
  }
};


function goToPatient(patient)
{
  router.push({
    name: 'patient',
    params: { uid: patient?patient.uid:0 }
  });
}

onMounted(() => {
  fetchPatients();
});

</script>

<style scoped>
@import '../assets/views.css';

.danger { color:var(--stimeo-danger) }

</style>