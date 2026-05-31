<template>
  <div class="page-container">

    <div class="page-header">
      <div class="header-titles">
        <h1>Catalogue</h1>
        <p>Gestion des références fournisseurs</p>
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

    <div class="action-card">
      <form @submit.prevent="handleImport" class="import-form">
        <div class="action-bar-group manufacturer-group">
          <select id="manufacturer" v-model="selectedManufacturer" required class="form-control">
            <option value="" disabled selected>Indiquer le fournisseur</option>
            <option value="Manfred Sauer">Manfred Sauer</option>
            <option value="Schwa Medico">Schwa Medico</option>
            <option value="Tensi+">Tensi+</option>
            <option value="Flowtens">Flowtens</option>
            <option value="Hollister">Hollister</option>
            <option value="Teleflex">Teleflex</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div class="action-bar-group" style="flex: 1;">
          <input type="file" id="file" class="form-control" accept=".csv, .json, .pdf, .xls, .xslx" @change="handleFileChange" required />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isUploading">
          <i v-if="isUploading" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-cloud-arrow-up"></i>
          <span>Importer</span>
        </button>
      </form>
    </div>

    <div class="table-scroll-container">
      <table class="stimeo-table">
        <thead>
        <tr>
          <th style="width: 15%;">Fournisseur</th>
          <th style="width: 15%;">Référence</th>
          <th style="width: 25%;">Libellé</th>
          <th style="width: 10%;">Qté</th>
          <th style="width: 10%; text-align: center;">LPP</th>
          <th style="width: 10%;">LPP Loc</th>
          <th style="width: 10%; text-align: center;">ACL</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="isLoadingTable">
          <td colspan="8" class="empty-state">
            <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;" />
            <p>Chargement des références...</p>
          </td>
        </tr>
        <template v-else-if="filteredCatalog.length > 0">
          <tr v-for="(item, index) in filteredCatalog" :key="index">
            <td class="font-semibold text-truncate">{{ item.manufacturer }}</td>
            <td><span class="ref-badge">{{ item.reference }}</span></td>
            <td class="text-wrap">{{ item.label }}</td>
            <td class="text-wrap">{{ item.quantity }}</td>
            <td class="text-center">{{ item.lpp }}</td>
            <td class="text-wrap">{{ item.lpprent }}</td>
            <td class="text-center">{{ item.acl }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="8" class="empty-state">
            <font-awesome-icon icon="fa-regular fa-folder-open" style="font-size: 1.5rem; margin-bottom: 10px;" />
            <p>Aucune référence enregistrée</p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import axios from "axios";
import {convertFileToBase64} from "@/utils/file.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {API_BASE_URL} from "@/utils/http.js";
import {storageService} from "@/utils/storage.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const selectedManufacturer = ref('');
const selectedFile = ref(null);
const isUploading = ref(false);
const searchQuery = ref('');

// Données d'exemple
const catalogItems = ref([]);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) selectedFile.value = file;
};

const handleImport = async () => {
  if (!selectedManufacturer.value || !selectedFile.value) return;

  isUploading.value = true;

  try {
    const base64Content = await convertFileToBase64(selectedFile.value);

    const payload = {
      manufacturer: selectedManufacturer.value,
      filename: selectedFile.value.name,   // for the backend to workout the file format
      fileData: base64Content             // base64 file
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    msgModal.show('Traitement en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/catalog/post', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      if (response.data) catalogItems.value = response.data;

      msgModal.show('En cours', "Le fichier a bien été envoyé. Comme le temps de traitement par l'I.A peut être long, vous serez prévenu par email à l'issue de l'analyse.", 'OK',msgModal.defaultClose);

      // Reset du formulaire
      selectedFile.value = null;
      selectedManufacturer.value = '';
      document.getElementById('file').value = '';
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',msgModal.defaultClose);
    }

  } catch (error) {
    console.error("Erreur lors de l'importation JSON:", error);
    msgModal.show('Erreur', "Une erreur est survenue lors de l'envoi du fichier.", 'OK',msgModal.defaultClose);
  } finally {
    isUploading.value = false;
  }
};

const filteredCatalog = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return catalogItems.value;
  return catalogItems.value.filter(item => {
    return (
        item.manufacturer?.toLowerCase().includes(query) ||
        item.reference?.toLowerCase().includes(query) ||
        item.label?.toLowerCase().includes(query) ||
        item.lpp?.toLowerCase().includes(query)  ||
        item.lpprent?.toLowerCase().includes(query)  ||
        item.acl?.toLowerCase().includes(query)
    );
  });
});

const isLoadingTable = ref(false);
const fetchCatalog = async () => {
  isLoadingTable.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    const response = await axios.get(API_BASE_URL+'/admin/catalog/get',axiosRequestConfig);

    catalogItems.value = response.data;
  } catch (error) {
    console.log("error whilst fetching the catalog", error);
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(() => {
  fetchCatalog();
});
</script>

<style scoped>
@import '../assets/views.css';
@import '../assets/forms.css';


.action-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
  border: 1px solid #f1f5f9;
}

.action-bar-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

</style>