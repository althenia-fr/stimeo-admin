<template>
  <div class="page-container">

    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">
          Interventions Idels
        </h2>
        <p class="subtitle">Suivi des Rendez-Vous Idels</p>
      </div>
    </div>

    <div class="table-container">
      <div v-if="isLoadingTable" class="empty-state">
        <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;" />
        <p>Chargement des données...</p>
      </div>

      <div v-if="!isLoadingTable && groupedIdelComs.length === 0" class="empty-state">
        <i class="fa-solid fa-users-slash"></i>
        <p>Pas de données</p>
      </div>

      <table v-else v-for="(period, periodIndex) in groupedIdelComs" :key="periodIndex" class="data-table">
        <thead>
        <tr>
          <th colspan="5">{{ period.label }}</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(idel, indexGroupByIdel) in period.groupByIdel" :key="idel.idelUid">

          <tr @click="toggleIdel(periodIndex, indexGroupByIdel)" class="clickable-row">
            <td>
              <font-awesome-icon
                  :icon="isExpanded(periodIndex, indexGroupByIdel) ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'"
                  style="margin-right: 8px;"
              />
              <strong>{{ idel.name }}</strong>
            </td>
            <td colspan="2">{{ idel.patients }}</td>
            <td colspan="2">{{ idel.total }} visite{{ idel.total > 1 ? 's' : '' }}</td>
          </tr>

          <tr
              v-if="isExpanded(periodIndex, indexGroupByIdel)"
              v-for="(visit, visitIndex) in idel.visits"
              :key="visitIndex"
              class="sub-row"
          >
            <td class="indent-cell">
              {{ formatDate(visit.visitTsSec) || 'Date non spécifiée' }}
            </td>
            <td> <span class="patient-name">{{ visit.patientName }}</span></td>
            <td>{{visit.sourceIdel}}</td>
            <td>{{visit.visitStatus}}</td>
            <td class="action-cell">
              <button @click.stop="triggerCommission(idel, visit)" class="btn-commission">
                Commission
              </button>
            </td>
          </tr>

        </template>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { storageService } from "@/utils/storage.js";
import axios from "axios";
import { API_BASE_URL } from "@/utils/http.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted } from "vue";
import router from "@/router/router.js";

const goBack = () => {
  router.back()
}

const groupedIdelComs = ref([]);
const isLoadingTable = ref(false);

// Variable pour stocker la ligne IDEL actuellement dépliée
const expandedIdelKey = ref(null);

// Gestion du dépliement / repliement avec des index stricts
const toggleIdel = (periodIndex, idelIndex) => {
  const uniqueKey = `${periodIndex}-${idelIndex}`;

  if (expandedIdelKey.value === uniqueKey) {
    expandedIdelKey.value = null; // Replie si on reclique sur le même
  } else {
    expandedIdelKey.value = uniqueKey; // Déplie le groupe concerné
  }
};

const isExpanded = (periodIndex, idelIndex) => {
  return expandedIdelKey.value === `${periodIndex}-${idelIndex}`;
};

// Action du bouton commission
const triggerCommission = (idel, visit) => {
  console.log(`Commission déclenchée pour l'IDEL: ${idel.name} (UID: ${idel.idelUid}) - Patient: ${visit.patientName}`);
};

// Helper pour formater la date si nécessaire (Optionnel, adaptez selon votre format reçu)
const formatDate = (visitTsSec) => {
  if (!visitTsSec) return '';
  return new Date(visitTsSec*1000).toLocaleDateString('fr-FR');
};

const fetchIdelCommissions = async () => {
  isLoadingTable.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    const response = await axios.get(API_BASE_URL+'/admin/idel/visit/get', axiosRequestConfig);
    groupedIdelComs.value = groupIdelComs(response.data);
  } catch (error) {
    console.log("error whilst fetching idels", error);
  } finally {
    isLoadingTable.value = false;
  }
};

function groupIdelComs(idelComs)
{
  let res = []
  for(let i=0; i<idelComs.length; i++)
  {
    let idelComsIter = idelComs[i]
    let period = {}
    period.label = idelComsIter.label

    let groupByIdel = []
    for(let j=0; j<idelComsIter.visitsGroupedByIdel.length; j++)
    {
      let visitGroupedByIdel = idelComsIter.visitsGroupedByIdel[j]
      let groupByIdelItem = {}
      groupByIdelItem.name = visitGroupedByIdel.idelName
      groupByIdelItem.idelUid = visitGroupedByIdel.idelUid

      // AJOUT : On conserve le tableau des visites brutes pour générer les sous-lignes plus tard
      groupByIdelItem.visits = visitGroupedByIdel.visits;

      let patients = ""
      for(let k=0; k<visitGroupedByIdel.visits.length; k++)
      {
        let visit = visitGroupedByIdel.visits[k]
        if(k>0) patients+=', '
        patients += visit.patientName
      }

      groupByIdelItem.total = visitGroupedByIdel.visits.length
      groupByIdelItem.patients = patients
      groupByIdel.push(groupByIdelItem)
    }
    period.groupByIdel = groupByIdel
    res.push(period)
  }
  return res;
}

onMounted(() => {
  fetchIdelCommissions();
});
</script>

<style scoped>
@import '../assets/views.css';

/* Quelques règles de style pour rendre l'effet accordéon plus agréable */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}
.clickable-row:hover {
  background-color: #f5f5f5;
}
.sub-row {
  background-color: #fafafa;
  font-size: 0.9em;
}
.indent-cell {
  padding-left: 25px !important;
}
.patient-name {
  font-weight: 500;
}
.visit-date {
  color: #666;
  font-style: italic;
}
.btn-commission {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-commission:hover {
  background-color: #0056b3;
}
</style>