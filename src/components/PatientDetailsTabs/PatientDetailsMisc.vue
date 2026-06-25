<template>
  <div class="tabs-content">

    <div class="card-grid-2x">

      <div class="info-card">
        <h3 class="card-title">Autre</h3>

        <div class="form-group-inline">
          <label>Date de décès</label>
          <input type="text" class="form-control" placeholder="JJ/MM/AAAA"  @keyup="formatDate($event,patientData.patient,'localeDeathdate')" v-model="patientData.patient.localeDeathdate" />
        </div>

        <div class="form-group-inline">
          <label>Code comptable</label>
          <input type="text" class="form-control" disabled/> <!-- not supported yet; for future use -->
        </div>

        <div class="form-group-inline">
          <label>Compte auxiliaire</label>
          <input type="text" class="form-control" disabled/> <!-- not supported yet; for future use -->
        </div>

      </div>

      <div class="info-card red-border">

        <h3 class="card-title danger">Danger</h3>

        <button class="btn btn-danger"  @click="confirmDeleteModal()">Supprimer {{patientData.user?.firstname}} {{patientData.user?.lastname}}</button>


      </div>

    </div>

  </div>
</template>

<style scoped>

@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/card.css';

.red-border { border-left: 5px solid var(--stimeo-danger); }

.danger { color:var(--stimeo-danger) }

</style>
<script setup>

import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import router from "@/router/router.js";
import {patientData} from "../../utils/patient.js";
import {formatDate} from "@/utils/format.js";


const doDeletePatient = async () => {

  try {
    const payload = {
      uid: patientData.value.user.uid,
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
    const response = await axios.post(API_BASE_URL+'/admin/patient/delete', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      router.back()
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',msgModal.defaultClose);
    }

  } catch (error) {
    let err = error.response?prettyPrintErrorMsg(error.response):error.message
    console.error("Erreur:",err );
    if(err==='DATA_EXISTS') err = "On ne peut pas effacer le Patient car il est relié à des Prises en Charges";

    msgModal.show('Erreur', err, 'OK',msgModal.defaultClose);
  }
};

function confirmDeleteModal()
{
  msgModal.show('Effacer', "Voulez-vous vraiment effacer le Patient "+patientData.value.user?.firstname+" "+patientData.value.user?.lastname+"?", 'Effacer',function(){msgModal.defaultClose();doDeletePatient()}, "Annuler", msgModal.defaultClose, true);
}



</script>