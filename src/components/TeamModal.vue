<template>
  <Transition name="modal-fade">
    <div v-if="teamModal.isOpen" class="modal-overlay" @click.self="teamModal.defaultClose">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ teamModal.isEditing ? "Modifier le Service" : "Nouveau Service" }}</h3>
        </div>

        <form @submit.prevent="saveTeam">

          <div class="form-group">
            <label>Nom du Service</label>
            <input type="text" v-model="teamModal.form.name" required placeholder="Nom" class="form-control" />
          </div>
          <div class="form-group">
            <label>Spécialité</label>
            <input type="text" v-model="teamModal.form.service" required placeholder="Spécialité" class="form-control" />
          </div>

          <div class="form-group">
            <label>Etablissement</label>
            <select id="sid" v-model="teamModal.form.sid" required class="form-control">
              <option value="" disabled selected>Indiquer l'Etablissement</option>
              <option v-for="(site, index) in teamModal.sites"  :key=site.sid :value=site.sid>{{site.etablissement}}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Délégué Médical</label>
            <select id="sid" v-model="teamModal.form.stimeoDelegateUid" required class="form-control">
              <option value="" disabled selected>Indiquer le Délégué</option>
              <option v-for="(delegate, index) in teamModal.delegates"  :key=delegate.uid :value=delegate.uid>{{delegate.firstname}} {{delegate.lastname}}</option>
            </select>        
          </div>
          
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" style="float: right" >Enregistrer</button>
            <button type="button" class="btn btn-secondary" style="float: right; margin-right: 15px" @click="teamModal.defaultClose">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>

import {teamModal} from "@/utils/modals/team-modal.js";
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import {onMounted, ref} from "vue";

const saveTeam = async () => {

  try {
    const payload = {
      ...teamModal.form,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    teamModal.isOpen = false
    msgModal.show('Envoi en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/team/post', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      if (response.data) teamModal.teams = response.data;
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();teamModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='TEAM_EXISTS') err = 'Ce service existe déjà';

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();teamModal.isOpen = true;});
  }
};


const isLoadingData = ref(false);
const fetchTeamModalData = async () => {
  isLoadingData.value = true;
  try {
    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }
    msgModal.show('Initialisation en cours', "Veuillez patienter...");
    const response = await axios.get(API_BASE_URL+'/admin/team/getData',axiosRequestConfig);
    msgModal.defaultClose();

    teamModal.delegates = response.data.delegates;
    teamModal.sites = response.data.sites;

  } catch (error) {
    console.log("error whilst fetching team data", error);
  } finally {
    isLoadingData.value = false;
  }
};


onMounted(() => {
  fetchTeamModalData();
});

</script>


<style scoped>
@import '../assets/modal.css';
@import '../assets/views.css';
@import '../assets/forms.css';

.form-group {
  margin-bottom: 15px;
}

</style>
