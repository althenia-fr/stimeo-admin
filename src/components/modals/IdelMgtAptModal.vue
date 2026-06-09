<template>
  <Transition name="modal-fade">
    <div v-if="idelMgtAptModal.isOpen && !idelMgtAptModal.isLoadingData" class="modal-overlay" @click.self="idelMgtAptModal.defaultClose">
      <div class="modal-content">
        <div class="modal-header">
          <h3>IDEL Gestion du Rendez-Vous</h3>
        </div>

        <form @submit.prevent="saveIdel">

          <div v-if="idelMgtAptModal.form.idelType" class="form-group">
            <label>Provenance de l'IDEL</label>
            <input type="text" v-model="idelMgtAptModal.form.idelType" class="form-control" disabled/>
          </div>

          <div class="form-group">
            <label>Idel</label>
            <select v-model="idelMgtAptModal.form.idelUid" required class="form-control">
              <option value="" disabled selected>Choisissez l'Idel</option>
              <option v-for="(idel, index) in idelMgtAptModal.localIdels"  :key=idel.uid :value=idel.uid>{{idel.firstname}} {{idel.lastname}} - {{idel.phone}} </option>
            </select>
          </div>

          <div class="form-group">
            <label>RDV idel (JJ/MM/AAAA hh:mm)</label>
            <input type="text" v-model="idelMgtAptModal.form.prettyApt" class="form-control" placeholder="JJ/MM/AAAA hh:mm"/>
          </div>


          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" style="float: right" >Enregistrer</button>
            <button type="button" class="btn btn-secondary" style="float: right; margin-right: 15px" @click="idelMgtAptModal.defaultClose">Annuler</button>
          </div>

        </form>

      </div>
    </div>
  </Transition>
</template>

<script setup>

import {idelMgtAptModal} from "@/utils/modals/idel-mgt-apt-modal.js";
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import {teamModal} from "@/utils/modals/team-modal.js";

const emit = defineEmits(['pec-updated']);

const saveIdel = async () => {

  try {
    const payload = {
      ...idelMgtAptModal.form,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    idelMgtAptModal.isOpen = false
    msgModal.show('Envoi en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/pec/idel/post', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200) emit('pec-updated', idelMgtAptModal.form.pecid);
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();idelMgtAptModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    if(err==='DATE_BAD_FORMAT') err = "La date du RDV n'est pas au format JJ/MM/AAAA hh:mm:ss";

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();idelMgtAptModal.isOpen = true;});
  }
};

</script>


<style scoped>
@import '../../assets/modal.css';
@import '../../assets/views.css';
@import '../../assets/forms.css';

.form-group {
  margin-bottom: 15px;
}

</style>
