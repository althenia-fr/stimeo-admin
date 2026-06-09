<template>
  <Transition name="modal-fade">
    <div v-if="siteModal.isOpen" class="modal-overlay" @click.self="siteModal.defaultClose">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ siteModal.isEditing ? "Modifier l'établissement" : "Nouvel établissement" }}</h3>
        </div>

        <form @submit.prevent="saveSite">

          <div class="form-group">
            <label>Finess</label>
            <input type="text" v-model="siteModal.form.finess" required placeholder="Finess" class="form-control" />
          </div>
          <div class="form-group">
            <label>Etablissement</label>
            <input type="text" v-model="siteModal.form.etablissement" required placeholder="Nom" class="form-control" />
          </div>

          <div class="form-group">
            <label>Adresse</label>
            <input type="text" v-model="siteModal.form.address1" required placeholder="Adresse" class="form-control" />
          </div>

          <div class="form-group">
            <label>Complement d'adresse</label>
            <input type="text" v-model="siteModal.form.address2" placeholder="Complément" class="form-control" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Code Postal</label>
              <input type="text" v-model="siteModal.form.postcode" required placeholder="Code Postal" class="form-control" />
            </div>
            <div class="form-group">
              <label>Ville</label>
              <input type="text" v-model="siteModal.form.city" required placeholder="Ville" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label>Téléphone</label>
            <input type="text" v-model="siteModal.form.phone" placeholder="optionnel" class="form-control" />
          </div>


          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" style="float: right" >Enregistrer</button>
            <button type="button" class="btn btn-secondary" style="float: right; margin-right: 15px" @click="siteModal.defaultClose">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>

import {siteModal} from "@/utils/modals/site-modal.js";
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";


const saveSite = async () => {

  try {
    const payload = {
      ...siteModal.form,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    siteModal.isOpen = false
    msgModal.show('Envoi en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/site/post', payload,axiosRequestConfig);
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
    if(err==='EMAIL_EXISTS') err = 'Cet email existe déjà';
    else if(err==='PHONE_EXISTS') err = 'Un délégué existe déjà avec ce numero de téléphone';

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();siteModal.isOpen = true;});
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
