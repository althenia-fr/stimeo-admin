<template>
  <div class="page-container">

    <div class="page-header">
      <div class="header-titles">
        <h2 class="title"><font-awesome-icon @click="goBack" class="clickable" icon="fa-solid fa-arrow-left-long"/> Idels</h2>
        <p class="subtitle">Gestion des Idels</p>
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
      <button class="btn btn-primary" @click="idelModal.openAddModal">
        <font-awesome-icon icon="fa-solid fa-plus"/> Ajouter Idel
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>RPPS</th>
          <th>Nom</th>
          <th>Email</th>
          <th style="width: 15%">Mobile</th>
          <th>Geoloc</th>
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
        <tr v-if="!isLoadingTable && filteredIdels.length === 0">
          <td colspan="6" class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>Pas de données</p>
          </td>
        </tr>
        <tr v-else v-for="(idel, index) in filteredIdels" :key="index">
          <td>{{ idel.rpps }}</td>
          <td class="font-semibold">{{ idel.lastname }} {{ idel.firstname }}</td>
          <td>{{ idel.email }}</td>
          <td class="font-mono">{{ idel.mobile }}</td>
          <td>{{ idel.address.longitude}} {{ idel.address.latitude}}</td>
          <td class="text-center">
            <button class="action-btn edit-btn" @click="idelModal.openEditModal(idel)" title="Modifier">
              <font-awesome-icon icon="fa-solid fa-pen"/>
            </button>
            &nbsp;
            <button class="action-btn edit-btn" @click="confirmDeleteModal(idel)" title="Effacer">
              <font-awesome-icon icon="fa-solid fa-trash-can"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <idelModal @idel-updated="fetchIdels"/>
  </div>
</template>

<script setup>
import {idelModal} from "@/utils/modals/idel-modal.js";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import IdelModal from "@/components/IdelModal.vue";
import {ref,computed, onMounted} from "vue";
import router from "@/router/router.js";

const goBack = () => {
  router.back()
}


const searchQuery = ref('');
const idels = ref([]);

const filteredIdels = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return idels.value;
  return idels.value.filter(item => {
    return (
        item.lastname?.toLowerCase()?.includes(query)
        || item.firstname?.toLowerCase()?.includes(query)
        || (''+item.rpps)?.toLowerCase()?.includes(query)
        || item.phone?.toLowerCase()?.includes(query)
        || item.email?.toLowerCase()?.includes(query)
    );
  });
});


const isLoadingTable = ref(false);
const fetchIdels = async () => {
  isLoadingTable.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    const response = await axios.get(API_BASE_URL+'/admin/idel/get',axiosRequestConfig);

    idels.value = response.data;
  } catch (error) {
    console.log("error whilst fetching idels", error);
  } finally {
    isLoadingTable.value = false;
  }
};


const doDeleteIdel = async (idel) => {

  try {
    const payload = {
      uid: idel.uid,
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
    const response = await axios.post(API_BASE_URL+'/admin/idel/delete', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      if (response.data) idels.value = response.data;
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();idelAptModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='DATA_EXISTS') err = "On ne peut pas effacer l'Idel car des Prises en Charges lui sont reliées";

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();});
  }
};

function confirmDeleteModal(idel)
{
  msgModal.show('Effacer', "Voulez-vous vraiment effacer l'Idel "+idel.firstname+" "+idel.lastname+" "+idel.email+" ?", 'Effacer',function(){msgModal.defaultClose();doDeleteIdel(idel)}, "Annuler", msgModal.defaultClose, true);
}


onMounted(() => {
  fetchIdels();
});

</script>

<style scoped>
@import '../assets/views.css';
</style>