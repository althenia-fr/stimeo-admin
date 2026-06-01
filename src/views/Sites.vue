<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">Etablissement</h2>
        <p class="subtitle">Gestion des Etablissements de soin</p>
      </div>
      <button class="btn btn-primary" @click="siteModal.openAddModal">
        <i class="fa-solid fa-plus"></i> Ajouter un Etablissement
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th style="width: 15%;">Finess</th>
          <th >Nom</th>
          <th>Adresse</th>
          <th style="width: 15%">Téléphone</th>
          <th class="text-center" style="width: 10%">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="isLoadingTable">
          <td colspan="5" class="empty-state">
            <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;" />
            <p>Chargement des données...</p>
          </td>
        </tr>
        <tr v-if="!isLoadingTable && siteModal.sites.length === 0">
          <td colspan="5" class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>Pas de données</p>
          </td>
        </tr>
        <tr v-else v-for="(site, index) in siteModal.sites" :key="index">
          <td class="font-semibold">{{ site.finess }}</td>
          <td>{{ site.etablissement }}</td>
          <td>{{ site.address1 }}, {{ site.address2 }} {{ site.postcode }} {{ site.city }} </td>
          <td>{{ site.phone }}</td>
          <td class="text-center">
            <button class="action-btn edit-btn" @click="siteModal.openEditModal(site)" title="Modifier">
              <font-awesome-icon icon="fa-solid fa-pen"/>
            </button>
            &nbsp;
            <button class="action-btn edit-btn" @click="confirmDeleteModal(site)" title="Effacer">
              <font-awesome-icon icon="fa-solid fa-trash-can"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <SiteModal />

  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import SiteModal from "@/components/SiteModal.vue";
import {siteModal} from "@/utils/modals/site-modal.js";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {delegateModal} from "@/utils/modals/delegate-modal.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";

const isLoadingTable = ref(false);
const fetchSites = async () => {
  isLoadingTable.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    const response = await axios.get(API_BASE_URL+'/admin/site/get',axiosRequestConfig);

    siteModal.sites = response.data;
  } catch (error) {
    console.log("error whilst fetching sites", error);
  } finally {
    isLoadingTable.value = false;
  }
};

const doDeleteSite = async (site) => {

  try {
    const payload = {
      sid: site.sid,
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
    const response = await axios.post(API_BASE_URL+'/admin/site/delete', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      if (response.data) siteModal.sites = response.data;
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();siteModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='DATA_EXISTS') err = "On ne peut pas effacer l'Etablissement car il est relié à des Services";
    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();});
  }
};



function confirmDeleteModal(site)
{
  msgModal.show('Effacer', "Voulez-vous vraiment effacer l'Etablissement "+site.etablissement+"?", 'Effacer',function(){msgModal.defaultClose();doDeleteSite(site)}, "Annuler", msgModal.defaultClose, true);
}

onMounted(() => {
  fetchSites();
});

</script>

<style scoped>
@import '../assets/views.css';
</style>