<template>
  <div class="tabs-content">

    <div class="card-grid-2x">

      <div class="info-card red-border">

        <h3 class="card-title danger">Danger</h3>

        <button class="btn btn-danger"  @click="confirmDeleteModal(pec)">Supprimer la Prise en Charge de {{pec.patientName}}</button>


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

defineProps({
  pec: Object,
});


const doDeletePec = async (pec) => {

  try {
    const payload = {
      pecid: pec.pecid,
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
    const response = await axios.post(API_BASE_URL+'/admin/pec/delete', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      router.back()
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose()});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='DATA_EXISTS') err = "On ne peut pas effacer la Prise en Charge car elle a commencé à être traitée.";

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();});
  }
};

function confirmDeleteModal(pec)
{
  msgModal.show('Effacer', "Voulez-vous vraiment effacer la Prise en Charge pour "+pec.patientName+"?", 'Effacer',function(){msgModal.defaultClose();doDeletePec(pec)}, "Annuler", msgModal.defaultClose, true);
}



</script>