<template>
  <Transition name="modal-fade">
    <div v-if="delegateModal.isOpen" class="modal-overlay" @click.self="delegateModal.defaultClose">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ delegateModal.isEditing ? 'Modifier le Délégué' : 'Nouveau Délégué' }}</h3>
        </div>

        <form @submit.prevent="saveDelegate">
          <div class="form-row">
            <div class="form-group">
              <label>Nom</label>
              <input type="text" v-model="delegateModal.form.lastname" required placeholder="Nom" class="form-control" />
            </div>
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" v-model="delegateModal.form.firstname" required placeholder="Prenom" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="delegateModal.form.email" required placeholder="prenom.nom@mail.com" class="form-control" />
          </div>

          <div class="form-group">
            <label>Mobile</label>
            <input type="tel" v-model="delegateModal.form.mobile" required placeholder="06 12 34 56 78" class="form-control" />
          </div>

          <div class="form-group" v-if="!delegateModal.isEditing">
            <label>Mot de passe</label>
            <input
                type="text"
                v-model="delegateModal.form.password"
                placeholder="Mot de passe"
                class="form-control"
            />
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" style="float: right" >Enregistrer</button>
            <button type="button" class="btn btn-secondary" style="float: right; margin-right: 15px" @click="delegateModal.defaultClose">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>

import {delegateModal} from "@/utils/modals/delegate-modal.js";
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";


const saveDelegate = async () => {

  try {
    const payload = {
      ...delegateModal.form,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    delegateModal.isOpen = false
    msgModal.show('Envoi en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/delegate/post', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      if (response.data) delegateModal.delegates = response.data;
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();delegateModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='EMAIL_EXISTS') err = 'Cet email existe déjà';
    else if(err==='PHONE_EXISTS') err = 'Un délégué existe déjà avec ce numero de téléphone';

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();delegateModal.isOpen = true;});
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
