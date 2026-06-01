<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">Membres</h2>
        <p class="subtitle">Membres du service {{team.service}}, {{team.name}}</p>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>Nom</th>
          <th>Role</th>
          <th >Téléphone</th>
          <th >Email</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="isLoadingTable">
          <td colspan="4" class="empty-state">
            <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;" />
            <p>Chargement des données...</p>
          </td>
        </tr>
        <tr v-if="teamMembers.length===0">
          <td colspan="4" class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>Pas de données</p>
          </td>
        </tr>
        <tr v-else v-for="(teamMember, index) in teamMembers" :key="index">
          <td class="font-semibold">{{teamMember.role===1?'Dr ':''}}{{ teamMember.firstname }} {{ teamMember.lastname }}</td>
          <td>{{ teamMember.roleLabel }}</td>
          <td>{{ teamMember.phone }}</td>
          <td>{{ teamMember.email }}</td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

// Récupération directe du paramètre de l'URL grâce à 'props: true' dans le router

const props = defineProps({
  tid: {
    type: String,
    required: true
  }
});

const teamMembers = ref([])
const team = ref({})

const isLoadingTable = ref(false);

const fetchTeamMembers = async () => {
  isLoadingTable.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    const response = await axios.get(API_BASE_URL+'/admin/member/get?tid='+props.tid,axiosRequestConfig);
    teamMembers.value = response.data.members;
    team.value = response.data.team;

  } catch (error) {
    console.log("error whilst fetching delegates", error);
  } finally {
    isLoadingTable.value = false;
  }
};


onMounted(() => {
  fetchTeamMembers();
});

</script>

<style scoped>
@import '../assets/views.css';
</style>