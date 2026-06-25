<template>
  <div class="page-container">

    <div class="documents-layout-grid">

      <div class="documents-sidebar">
        <div
            v-for="doc in pec.docs"
            :key="doc.sdid"
            class="info-card mini-doc-card clickable"
            :class="{ 'active-doc-card': selectedDoc?.sdid === doc.sdid }"
            @click="selectDocument(doc)"
        >
          <div class="doc-card-header">
            <span class="doc-type">{{ capitalizeFirstLetter(doc.docTypeLongLabel) }}</span>
            <span class="ref-badge status-badge" :class="doc.party1Signed?'badge-success':'badge-warning'"> {{ doc.party1Signed?'signé':'non signé' }}</span>
          </div>
          <div class="doc-card-body">
            <span class="doc-date">Daté du {{ doc.dateStr }}</span>
          </div>
          <div class="doc-card-actions">

            <a
                :href="doc.pdfUrl"
                download
                target="_blank"
                class="btn btn-download"
                @click.stop
            >
              <font-awesome-icon icon="fa-solid fa-download" />
              Télécharger
            </a>
            <br v-if="!doc.party1Signed" />

            <a v-if="!doc.party1Signed" class="btn btn-download" @click="function(){sendReminder(doc,pec.patientName)}">Envoyer un rappel</a>

          </div>

        </div>
      </div>

      <div class="documents-preview-zone">
        <div v-if="selectedDoc" class="info-card preview-card">
          <div class="preview-header">
            <h3 class="card-title" style="margin: 0">{{ capitalizeFirstLetter(selectedDoc.docTypeLongLabel) }} - Aperçu</h3>

            <div v-if="selectedDoc.totalPages > 1" class="preview-pagination">
              <button
                  class="btn btn-secondary btn-sm"
                  @click="prevPage"
              >
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
              </button>
              <span class="page-indicator">Page {{ currentPage }} / {{ selectedDoc.totalPages }}</span>
              <button
                  class="btn btn-secondary btn-sm"
                  @click="nextPage"
              >
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
              </button>
            </div>
          </div>

          <div class="preview-viewport">
            <img
                :src="selectedDoc.previewPageUrls[currentPage - 1]"
                :alt="selectedDoc.docTypeLabel"
                class="preview-image"
            />
          </div>
        </div>

        <div v-else class="info-card empty-state">
          <font-awesome-icon icon="fa-solid fa-file-pdf" style="font-size: 2.5rem; margin-bottom: 1rem;" />
          <p>Sélectionnez un document dans la liste pour afficher son aperçu.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from "@/router/router.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {idelModal} from "@/utils/modals/idel-modal.js";
import {patientData} from "@/utils/patient.js";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import {capitalizeFirstLetter} from "../../utils/format.js";

const props = defineProps({
  pec: Object,
});


const goBack = () => router.back();

const selectedDoc = ref(props.pec?.docs && props.pec.docs.length>0?props.pec.docs[0]:null);
const currentPage = ref(1);

const selectDocument = (doc) => {
  selectedDoc.value = doc;
  currentPage.value = 1; // Réinitialise toujours à la première page
};

const nextPage = () => {
  if (currentPage.value < selectedDoc.value.totalPages) currentPage.value++;
  else currentPage.value = 1
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
  else currentPage.value = selectedDoc.value.totalPages
};

function sendReminder(doc,patientName){

  async function doSendReminder()
  {

    try {
      const payload = {
        sdid: doc.sdid,
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
      const response = await axios.post(API_BASE_URL+'/admin/signreminder', payload,axiosRequestConfig);
      msgModal.defaultClose();

      if(response.status===200)
      {
        msgModal.show('Succès', "Le rappel a été envoyé", 'OK',msgModal.defaultClose);
      }
      else
      {
        msgModal.show('Erreur', "code "+response.status, 'OK',msgModal.defaultClose);
      }

    } catch (error) {
      let err = error.response?prettyPrintErrorMsg(error.response):error.message
      console.error("Erreur:",err );
      msgModal.show('Erreur', err, 'OK',msgModal.defaultClose);
    }
  }

  let msg = "Voulez-vous vraiment envoyer un email de rappel à "+doc.party1Name+" pour la signature du document "+capitalizeFirstLetter(doc.docTypeLongLabel)+"?"

  msgModal.show("Rappel", msg, 'Oui, envoyer',doSendReminder,'Annuler',msgModal.defaultClose,true);

}

</script>

<style scoped>
@import '@/assets/views.css';
@import '@/assets/card.css';

/* Agencement principal en 1/3 - 2/3 via CSS Grid */
.documents-layout-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 1.25rem;
  align-items: start;
}

/* Sidebar gauche */
.documents-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 4px;
}

/* Mini cartes de documents */
.mini-doc-card {
  transition: transform 0.15s, border-color 0.15s;
  padding: 0.9rem;
}

.mini-doc-card:hover {
  border-color: var(--stimeo-border);
  background-color: #f8fafc;
  text-decoration: none;
}

/* Style de la carte active / sélectionnée */
.active-doc-card {
  border-color: var(--stimeo-border);
  border-left: 4px solid var(--stimeo-border); /* Met en avant la carte sélectionnée avec la couleur primaire */
  background-color: #f1f5f9;
}

.doc-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 0.4rem;
}

.doc-type {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--stimeo-text);
  line-height: 1.3;
}

.doc-card-body {
  margin-bottom: 0.75rem;
}

.doc-date {
  font-size: 0.75rem;
  color: var(--stimeo-text-light);
}

.doc-card-actions {
  margin-top: auto; /* Pousse le bouton vers le bas si la carte s'agrandit */
}

/* Version optimisée du bouton pour la sidebar */
.btn-download {
  width: 100%;               /* Prend toute la largeur de la carte = zone de clic maximale */
  justify-content: center;    /* Centre l'icône et le texte */
  background: #f1f5f9;       /* Fond gris très doux neutre */
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 0.4rem 0.75rem;    /* Légèrement plus compact verticalement */
  font-size: 0.8rem;
  transition: all 0.15s ease;
  text-decoration: none;
}

.btn-download:hover {
  background: #475569 !important;
  color: white;
}

/* Ajustement de la carte active pour que le bouton s'accorde avec */
.active-doc-card .btn-download {
  background: #dadae3;
}

/* Zone d'affichage et prévisualisation droite */
.documents-preview-zone {
  height: calc(100vh - 200px);
}

.preview-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--stimeo-border);
  margin-bottom: 1rem;
}

.preview-pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-indicator {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--stimeo-text-light);
}

/* Boutons plus petits pour la barre d'outils d'aperçu */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

/* Conteneur de l'image d'aperçu */
.preview-viewport {
  flex-grow: 1;
  background-color: #f8fafc;
  border: 1px solid var(--stimeo-border);
  border-radius: 6px;
  padding: 1rem;

  /* FLUX DE DÉFILEMENT */
  overflow-y: auto;  /* Active le scroll vertical uniquement si nécessaire */
  overflow-x: hidden; /* Empêche tout scroll horizontal parasite */

  /* On retire le centrage Flexbox vertical pour que le document
     commence bien tout en haut de la zone de scroll */
  display: block;
}

.preview-image {
  width: 100%;        /* Force le document à prendre 100% de la largeur */
  height: auto;       /* Calcule la hauteur proportionnellement sans restriction */
  display: block;     /* Supprime l'espace blanc d'alignement sous l'image */
  margin: 0 auto;     /* Centre l'image horizontalement si besoin */

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  background: white;
}

/* Badges de statuts alternatifs exploitant votre base ref-badge */
.status-badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
}
.badge-success { background-color: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
.badge-warning { background-color: #fffbeb; color: #92400e; border-color: #fde68a; }
.badge-neutral { background-color: #f1f5f9; color: #475569; border-color: #cbd5e1; }
</style>