<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">Délégués</h2>
        <p class="subtitle">Gestion des Délégués Médicaux</p>
      </div>
      <button class="btn btn-primary" @click="delegateModal.openAddModal">
        <i class="fa-solid fa-plus"></i> Ajouter un Délégué
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>Nom</th>
          <th style="width: 15%">Prénom</th>
          <th>Email</th>
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
        <tr v-if="!isLoadingTable && delegateModal.delegates.length === 0">
          <td colspan="6" class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>Aucun délégué enregistré.</p>
          </td>
        </tr>
        <tr v-else v-for="(delegate, index) in delegateModal.delegates" :key="index">
          <td class="font-semibold">{{ delegate.lastname }}</td>
          <td>{{ delegate.firstname }}</td>
          <td>{{ delegate.email }}</td>
          <td class="font-mono">{{ delegate.mobile }}</td>
          <td class="text-center">
            <button class="action-btn edit-btn" @click="delegateModal.openEditModal(delegate)" title="Modifier">
              <font-awesome-icon icon="fa-solid fa-pen"/>
            </button>
            &nbsp;
            <button class="action-btn edit-btn" @click="confirmDeleteModal(delegate)" title="Effacer">
              <font-awesome-icon icon="fa-solid fa-trash-can"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <DelegateModal />

  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import DelegateModal from "@/components/DelegateModal.vue";
import {delegateModal} from "@/utils/modals/delegate-modal.js";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {siteModal} from "@/utils/modals/site-modal.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";

const isLoadingTable = ref(false);
const fetchDelegates = async () => {
  isLoadingTable.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    const response = await axios.get(API_BASE_URL+'/admin/delegate/get',axiosRequestConfig);

    delegateModal.delegates = response.data;
  } catch (error) {
    console.log("error whilst fetching delegates", error);
  } finally {
    isLoadingTable.value = false;
  }
};


const doDeleteDelegate = async (delegate) => {

  try {
    const payload = {
      uid: delegate.uid,
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
    const response = await axios.post(API_BASE_URL+'/admin/delegate/delete', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      if (response.data) delegateModal.delegates = response.data;
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();delegateModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='DATA_EXISTS') err = "On ne peut pas effacer le Délégué car il est relié à des Services";

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();});
  }
};

function confirmDeleteModal(delegate)
{
  msgModal.show('Effacer', "Voulez-vous vraiment effacer le Délégué Médical "+delegate.firstname+" "+delegate.lastname+"?", 'Effacer',function(){msgModal.defaultClose();doDeleteDelegate(delegate)}, "Annuler", msgModal.defaultClose, true);
}


onMounted(() => {
  fetchDelegates();
});

</script>

<style scoped>
@import '../assets/views.css';
</style>