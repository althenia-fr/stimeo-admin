<template>
  <Transition name="modal-fade">
    <div v-if="idelModal.isOpen" class="modal-overlay" @click.self="idelModal.defaultClose">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ idelModal.isEditing ? "Modifier l'IDEL" : 'Nouvel IDEL' }}</h3>
        </div>

        <form @submit.prevent="saveIdel">

          <!-- Navigation des onglets -->
          <div class="tabs-nav">
            <button type="button" :class="{ active: idelModal.activeTab === 'identity' }" @click="idelModal.activeTab = 'identity'">Identité</button>
            <button type="button" :class="{ active: idelModal.activeTab === 'contact' }" @click="idelModal.activeTab = 'contact'">Contact</button>
            <button type="button" :class="{ active: idelModal.activeTab === 'address' }" @click="idelModal.activeTab = 'address'">Zone</button>
            <button type="button" :class="{ active: idelModal.activeTab === 'bank' }" @click="idelModal.activeTab = 'bank'">Paiement</button>
            <button type="button" :class="{ active: idelModal.activeTab === 'skills' }" @click="idelModal.activeTab = 'skills'">Soins</button>
          </div>

          <div class="tabs-content">
            <!-- Tab 1 identity -->
            <div v-show="idelModal.activeTab === 'identity'">

              <div class="form-group">
                <label>RPPS</label>
                <input type="text" v-model="idelModal.form.rpps" placeholder="N° RPPS" class="form-control" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Nom</label>
                  <input type="text" v-model="idelModal.form.lastname" placeholder="Nom" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Prénom</label>
                  <input type="text" v-model="idelModal.form.firstname" placeholder="Prenom" class="form-control" />
                </div>
              </div>


            </div>

            <div v-show="idelModal.activeTab === 'contact'">


              <div class="form-group">
                <label>Email</label>
                <input type="text" v-model="idelModal.form.email" placeholder="prenom.nom@mail.com" class="form-control" />
              </div>

              <div class="form-group">
                <label>Mobile</label>
                <input type="text" v-model="idelModal.form.mobile" placeholder="06 ou 07 ....." class="form-control" />
              </div>

            </div>

            <!-- Tab Address -->
            <div v-show="idelModal.activeTab === 'address'">

              <div class="form-group">
                <label>N° + Voie</label>
                <input type="text" v-model="idelModal.form.address.add1" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Code Postal</label>
                  <input type="text" v-model="idelModal.form.address.zip" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Ville</label>
                  <input type="text" v-model="idelModal.form.address.city" class="form-control" />
                </div>
              </div>
              <div class="form-group">
                <label>Rayon d'intervention (km)</label>
                <input type="text" v-model="idelModal.form.radiusKm" class="form-control" />
              </div>

            </div>

            <!-- Tab Bank -->
            <div v-show="idelModal.activeTab === 'bank'">


              <div class="form-group">
                <label>IBAN</label>
                <input type="text" v-model="idelModal.form.iban" placeholder="FR..." class="form-control" />
              </div>

              <div class="form-group">
                <label>BIC</label>
                <input type="text" v-model="idelModal.form.bic" class="form-control" />
              </div>

            </div>


            <!-- Tab Qualifications -->
            <div v-show="idelModal.activeTab === 'skills'">

              <div class="form-group">
                <label>Soins acceptés</label>
                <textarea rows="5" type="text" v-model="idelModal.form.acceptedCare" disabled class="form-control"></textarea>
              </div>

              <div class="form-group">
                <label>Diplôme</label>
                <input type="text" v-model="idelModal.form.diploma" disabled class="form-control" />
              </div>

              <div class="form-group">
                <label>Certification</label>
                <input type="text" v-model="idelModal.form.certif" disabled class="form-control" />
              </div>

            </div>

          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" style="float: right" >Enregistrer</button>
            <button type="button" class="btn btn-secondary" style="float: right; margin-right: 15px" @click="idelModal.defaultClose">Annuler</button>
          </div>

        </form>


      </div>
    </div>
  </Transition>
</template>

<script setup>

import {idelModal} from "@/utils/modals/idel-modal.js";
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import {checkValidIdelForm} from "@/utils/idel.js";

const emit = defineEmits(['idel-updated']);


const saveIdel = async () => {

  let msg = checkValidIdelForm(idelModal.form);
  if(msg)
  {
    msgModal.show('Erreur',msg, 'OK', msgModal.defaultClose);
    return;
  }

  try {

    const payload = {
      ...idelModal.form,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    idelModal.isOpen = false
    msgModal.show('Envoi en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/idel/post', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200) emit('idel-updated');
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();idelModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='EMAIL_EXISTS') err = 'Cet email existe déjà';
    else if(err==='PHONE_EXISTS') err = 'Un IDEL existe déjà avec ce numero de téléphone';

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();idelModal.isOpen = true;});
  }
};


</script>


<style scoped>
@import '../../assets/modal.css';
@import '../../assets/views.css';
@import '../../assets/forms.css';
@import '../../assets/tabnav.css';

.form-group {
  margin-bottom: 15px;
}

.modal-content {
  max-width: 500px;
}

</style>
