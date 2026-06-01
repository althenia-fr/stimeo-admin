<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">Services</h2>
        <p class="subtitle">Gestion des Services</p>
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
        <tr v-if="!isLoadingTable && filteredTeams.length === 0">
          <td colspan="5" class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>Pas de données</p>
          </td>
        </tr>
        <tr v-else v-for="(team, index) in filteredTeams" :key="index">
          <td class="font-semibold clickable" @click="goToTeamMembers(team.tid)">{{ team.name }}</td>
          <td>{{ team.etablissement }}</td>
          <td>{{ team.service }} </td>
          <td>{{ team.delegateName }}</td>
          <td class="text-center">
            <button class="action-btn edit-btn" @click="teamModal.openEditModal(team)" title="Modifier">
              <font-awesome-icon icon="fa-solid fa-pen"/>
            </button>
            &nbsp;
            <button class="action-btn edit-btn" @click="confirmDeleteModal(team)" title="Effacer">
              <font-awesome-icon icon="fa-solid fa-trash-can"/>
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
import {computed, onMounted, ref} from 'vue';
import TeamModal from "@/components/TeamModal.vue";
import {teamModal} from "@/utils/modals/team-modal.js";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import router from "@/router/router.js";

const searchQuery = ref('');

const filteredTeams = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return teamModal.teams;
  return teamModal.teams.filter(item => {
    return (
        item.etablissement?.toLowerCase().includes(query) ||
        item.service?.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query) ||
        item.delegateName?.toLowerCase().includes(query)
    );
  });
});


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

const doDeleteTeam = async (team) => {

  try {
    const payload = {
      tid: team.tid,
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
    const response = await axios.post(API_BASE_URL+'/admin/team/delete', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      if (response.data) teamModal.teams = response.data;
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();teamModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='DATA_EXISTS') err = "On ne peut pas effacer le Service car son équipe contient des membres";
    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();});
  }
};


function confirmDeleteModal(team)
{
  msgModal.show('Effacer', "Voulez-vous vraiment effacer le Service "+team.name+"?", 'Effacer',function(){msgModal.defaultClose();doDeleteTeam(team)}, "Annuler", msgModal.defaultClose, true);
}

function goToTeamMembers(tid)
{
  router.push({
    name: 'members',
    params: { tid: tid }
  });
}

onMounted(() => {
  fetchTeams();
});

</script>

<style scoped>
@import '../assets/views.css';
</style>