<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">Services</h2>
        <p class="subtitle">Gestion des Services</p>
      </div>
      <button class="btn btn-primary" @click="teamModal.openAddModal">
        <i class="fa-solid fa-plus"></i> Ajouter un Service
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>Nom du Service</th>
          <th>Etablissement</th>
          <th>Spécialité</th>
          <th>Délégué</th>
          <th class="text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="isLoadingTable">
          <td colspan="5" class="empty-state">
            <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;" />
            <p>Chargement des données...</p>
          </td>
        </tr>
        <tr v-if="!isLoadingTable && teamModal.teams.length === 0">
          <td colspan="5" class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>Aucun service enregistré.</p>
          </td>
        </tr>
        <tr v-else v-for="(team, index) in teamModal.teams" :key="index">
          <td class="font-semibold">{{ team.name }}</td>
          <td>{{ team.etablissement }}</td>
          <td>{{ team.service }} </td>
          <td>{{ team.delegateName }}</td>
          <td class="text-center">
            <button class="action-btn edit-btn" @click="teamModal.openEditModal(team)" title="Modifier">
              <font-awesome-icon icon="fa-solid fa-pen"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <TeamModal />

  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import TeamModal from "@/components/TeamModal.vue";
import {teamModal} from "@/utils/modals/team-modal.js";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const isLoadingTable = ref(false);
const fetchTeams = async () => {
  isLoadingTable.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    const response = await axios.get(API_BASE_URL+'/admin/team/get',axiosRequestConfig);

    teamModal.teams = response.data;
  } catch (error) {
    console.log("error whilst fetching teams", error);
  } finally {
    isLoadingTable.value = false;
  }
};


onMounted(() => {
  fetchTeams();
});

</script>

<style scoped>
@import '../assets/views.css';
</style>