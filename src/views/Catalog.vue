<template>
  <div class="catalog-container">
    <div class="catalog-header">

      <div class="search-wrapper" style="float: right;">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon" style="padding-top: 2px;"/>
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher partout..."
            class="search-input"
        />
      </div>

      <h1>Catalogue</h1>
      <p>Gestion des références fournisseurs</p>

    </div>

    <div class="action-card">
      <form @submit.prevent="handleImport" class="import-form">
        <div class="form-group manufacturer-group">
          <select id="manufacturer" v-model="selectedManufacturer" required>
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

        <div class="form-group file-group">
          <input type="file" id="file" accept=".csv, .json, .pdf, .xls, .xslx" @change="handleFileChange" required />
        </div>

        <button type="submit" class="btn-import" :disabled="isUploading">
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
            <th style="width: 5%;">Qté</th>
            <th style="width: 10%; text-align: center;">LPP</th>
            <th style="width: 10%;">LPP Loc</th>
            <th style="width: 10%; text-align: center;">ACL</th>
            <th style="width: 10%; text-align: center;">EAN-13</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="isLoadingTable">
            <td colspan="6" class="empty-state">
              <p> Chargement des références...</p>
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
              <td class="text-center">{{ item.ean13 }}</td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="6" class="empty-state">
              <p> <font-awesome-icon icon="fa-regular fa-folder-open"/> Aucune référence enregistrée</p>
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
import {msgModal} from "@/utils/msg-modal.js";
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

    // 3. Appel POST Axios standard (le Content-Type passe automatiquement en application/json)
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
/* Conteneur principal plus serré */
.catalog-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.catalog-header h1 {
  color: var(--stimeo-primary);
  font-size: 1.5rem;
  font-weight: 700;
}
.catalog-header p {
  color: var(--stimeo-text-light);
  font-size: 0.85rem;
}

/* Cards plus discrètes */
.action-card {
  background: var(--stimeo-surface);
  border-radius: 8px;
  border: 1px solid var(--stimeo-border);
  padding: 0.75rem 1rem;
}

/* Formulaire d'import compact en une seule ligne */
.import-form {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--stimeo-text-light);
  white-space: nowrap;
}

.manufacturer-group select {
  width: 180px;
}

select, input[type="file"] {
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--stimeo-border);
  border-radius: 6px;
  font-size: 0.85rem;
  background: var(--stimeo-bg);
}

input[type="file"] {
  background: transparent;
  border: none;
  padding: 0;
}

.btn-import {
  padding: 0.4rem 1rem;
  background: var(--stimeo-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto; /* Pousse le bouton à droite */
}

/* Section Tableau */
.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.table-actions h2 {
  font-size: 1rem;
  color: var(--stimeo-primary);
}

.search-wrapper {
  position: relative;
  width: 240px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--stimeo-text-light);
  font-size: 0.8rem;
}

.search-input {
  width: 100%;
  padding: 0.4rem 0.5rem 0.4rem 1.8rem;
  border: 1px solid var(--stimeo-border);
  border-radius: 6px;
  font-size: 0.85rem;
}

/* Container de scroll si +100 lignes */
.table-scroll-container {
  max-height: 65vh; /* Bloque la hauteur pour voir le reste de l'écran */
  overflow-y: auto;
  border: 1px solid var(--stimeo-border);
  border-radius: 6px;
}

/* Tableau Haute Densité (Paddings réduits) */
.stimeo-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem; /* Texte globalement plus petit */
}

.stimeo-table th {
  background-color: var(--stimeo-bg);
  color: var(--stimeo-primary);
  font-weight: 700;
  padding: 0.5rem 0.75rem; /* Padding très serré */
  position: sticky;
  top: 0; /* Bloque le header du tableau pendant le scroll */
  z-index: 1;
  border-bottom: 1px solid var(--stimeo-border);
}

.stimeo-table td {
  padding: 0.4rem 0.75rem; /* Hauteur de ligne ultra-réduite */
  border-bottom: 1px solid var(--stimeo-border);
  vertical-align: middle;
  line-height: 1.3;
}

.stimeo-table tbody tr:hover {
  background-color: rgba(0, 212, 178, 0.04);
}

/* Optimisation des cellules */
.font-semibold { font-weight: 600; }
.font-mono { font-family: monospace; font-size: 0.9rem; }
.text-center { text-align: center; }
.text-accent { color: var(--stimeo-primary); font-weight: 700; }

.ref-badge {
  background: var(--stimeo-bg);
  padding: 2px 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--stimeo-primary);
  font-family: monospace;
}

.text-truncate {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 2rem !important;
  color: var(--stimeo-text-light);
}
</style>