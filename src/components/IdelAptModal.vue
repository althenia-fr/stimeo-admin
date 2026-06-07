<template>
  <Transition name="modal-fade">
    <div v-if="idelAptModal.isOpen && !idelAptModal.isLoadingData" class="modal-overlay" @click.self="idelAptModal.defaultClose">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Gestion du Rendez-Vous</h3>
        </div>

        <form @submit.prevent="saveIdel">

          <div v-if="idelAptModal.form.idelType" class="form-group">
            <label>Provenance de l'IDEL</label>
            <input type="text" v-model="idelAptModal.form.idelType" class="form-control" disabled/>
          </div>

          <div v-if="!idelAptModal.form.patientHasOwnIdel" class="form-group">
            <label>Status Medicalib</label>
            <input type="text" v-model="idelAptModal.form.medicalibStatus" class="form-control" disabled/>
          </div>

          <div class="form-group">
            <label>RDV idel (JJ/MM/AAAA hh:mm)</label>
            <input type="text" v-model="idelAptModal.form.prettyApt" class="form-control" placeholder="JJ/MM/AAAA hh:mm"/>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Nom</label>
              <input type="text" v-model="idelAptModal.form.idelLastname" required class="form-control" />
            </div>
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" v-model="idelAptModal.form.idelFirstname" required class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label>Mobile</label>
            <input type="text" v-model="idelAptModal.form.idelPhone" required class="form-control" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="text" v-model="idelAptModal.form.idelEmail" required class="form-control" />
          </div>
          
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" style="float: right" >Enregistrer</button>
            <button type="button" class="btn btn-secondary" style="float: right; margin-right: 15px" @click="idelAptModal.defaultClose">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>

import {idelAptModal} from "@/utils/modals/idel-apt-modal.js";
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";

const emit = defineEmits(['pec-updated']);

const saveIdel = async () => {

  try {
    const payload = {
      ...idelAptModal.form,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    idelAptModal.isOpen = false
    msgModal.show('Envoi en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/pec/idel/post', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      emit('pec-updated', idelAptModal.form.pecid);
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();idelAptModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    if(err==='DATE_BAD_FORMAT') err = "La date du RDV n'est pas au format JJ/MM/AAAA hh:mm:ss";

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();idelAptModal.isOpen = true;});
  }
};

</script>


<style scoped>
@import '../assets/modal.css';
@import '../assets/views.css';
@import '../assets/forms.css';

.form-group {
  margin-bottom: 15px;
}

</style>
