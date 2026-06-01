<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">Prises en charge</h2>
        <p class="subtitle">Suivi des Prises en charge</p>
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
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>Création</th>
          <th>Patient</th>
          <th>Prescripteur</th>
          <th>Protocole</th>
          <th>Statut</th>
          <th>Idel</th>
          <th>Caution</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="isLoadingTable">
          <td colspan="7" class="empty-state">
            <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;" />
            <p>Chargement des données...</p>
          </td>
        </tr>
        <tr v-if="!isLoadingTable && filteredPecs.length === 0">
          <td colspan="7" class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>Pas de données</p>
          </td>
        </tr>
        <tr v-else v-for="(pec, index) in filteredPecs" :key="index">
          <td>{{ new Intl.DateTimeFormat('fr-FR').format(new Date(pec.createdOn)) }}</td>
          <td class="font-semibold">{{ pec.patientName }}</td>
          <td>{{ pec.doctorName }}</td>
          <td>{{ pec.protocol }} </td>
          <td>{{ pec.installLabel }}</td>
          <td @click="idelModal.openModal(pec)" :class="canOpenIdelModal(pec)?'clickable':''">{{ pec.idelStatus }}</td>
          <td>{{ pec.depositLabel }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <IdelModal @pec-updated="fetchPecs"/>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import IdelModal from "@/components/IdelModal.vue";
import {canOpenIdelModal, idelModal} from "@/utils/modals/idel-modal.js";

const searchQuery = ref('');
const pecs = ref([])

const filteredPecs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return pecs.value;
  return pecs.value.filter(item => {
    return (
        item.patientName?.toLowerCase().includes(query) ||
        item.doctorName?.toLowerCase().includes(query) ||
        item.protocol?.toLowerCase().includes(query) ||
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
    const response = await axios.get(API_BASE_URL+'/admin/pec/get',axiosRequestConfig);

    pecs.value = response.data;
  } catch (error) {
    console.log("error whilst fetching teams", error);
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(() => {
  fetchPecs();
});

</script>

<style scoped>
@import '../assets/views.css';

</style>