<template>
  <Transition name="modal-fade">
    <div v-if="patientModal.isOpen" class="modal-overlay" @click.self="patientModal.defaultClose">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ patientModal.isEditing ? 'Modifier le Patient' : 'Nouveau Patient' }}</h3>
        </div>

        <form @submit.prevent="savePatient">


          <!-- Navigation des onglets -->
          <div class="tabs-nav">
            <button type="button" :class="{ active: patientModal.activeTab === 'identity' }" @click="patientModal.activeTab = 'identity'">Identité</button>
            <button type="button" :class="{ active: patientModal.activeTab === 'contact' }" @click="patientModal.activeTab = 'contact'">Contact</button>
            <button type="button" :class="{ active: patientModal.activeTab === 'address' }" @click="patientModal.activeTab = 'address'">Adresse</button>
            <button type="button" :class="{ active: patientModal.activeTab === 'helper' }" @click="patientModal.activeTab = 'helper'">Aidant</button>
          </div>

          <!-- Contenu des onglets -->
          <div class="tabs-content">
            <!-- Tab 1 identity -->
            <div v-if="patientModal.activeTab === 'identity'">

              <div class="form-group">
                <label>NIR</label>
                <input type="text" v-model="patientModal.form.nir" class="form-control" />
              </div>


              <div class="form-row">

                <div class="form-group">
                  <label>Nom</label>
                  <input type="text" v-model="patientModal.form.lastname" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Prénom</label>
                  <input type="text" v-model="patientModal.form.firstname" class="form-control" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Civilité</label>
                  <select  v-model="patientModal.form.gender" class="form-control">
                    <option :value=0 disabled>Choisissez...</option>
                    <option :value=1>Monsieur</option>
                    <option :value=2>Madame</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Date Naissance</label>
                  <input type="text" @keyup="formatDate" v-model="patientModal.form.localBirthdate" placeholder="JJ/MM/AAAA" class="form-control" />
                </div>
              </div>

            </div>

            <!-- Tab 2 : Contact -->
            <div v-if="patientModal.activeTab === 'contact'">
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="patientModal.form.email" class="form-control" />
              </div>
              <div class="form-group">
                <label>Mobile</label>
                <input type="text" v-model="patientModal.form.phone" class="form-control" />
              </div>
            </div>


            <!-- Tab 3 : Address -->
            <div v-if="patientModal.activeTab === 'address'">
              <div class="form-group">
                <label>N° + Voie</label>
                <input type="text" v-model="patientModal.form.address.add1" class="form-control" />
              </div>
              <div class="form-group">
                <label>Complément d'Adresse</label>
                <input type="text" v-model="patientModal.form.address.add2" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Code Postal</label>
                  <input type="text" v-model="patientModal.form.address.zip" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Ville</label>
                  <input type="text" v-model="patientModal.form.address.city" class="form-control" />
                </div>
              </div>
            </div>

            <!-- Onglet 4 : helper -->
            <div v-if="patientModal.activeTab === 'helper'">

              <div class="form-group">
                <label>Prénom + Nom</label>
                <input type="text" v-model="patientModal.form.helper.name" placeholder="Prénom + Nom de l'aidant" class="form-control" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="patientModal.form.helper.email" placeholder="email@domaine.com" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Mobile</label>
                  <input type="tel" v-model="patientModal.form.helper.phone" placeholder="06 ou 07..." class="form-control" />
                </div>
                <div class="form-group">
                  <label>Lien avec le patient</label>
                  <input type="text" v-model="patientModal.form.helper.relationship" placeholder="Ex: parent, ami , etc..." class="form-control" />
                </div>
              </div>

            </div>
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" style="float: right" >Enregistrer</button>
            <button type="button" class="btn btn-secondary" style="float: right; margin-right: 15px" @click="patientModal.defaultClose">Annuler</button>
          </div>

        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>

import {patientModal} from "@/utils/modals/patient-modal.js";
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";

const emit = defineEmits(['patient-updated']);

const formatDate = (event) => {
  // 1. Si l'utilisateur appuie sur Retour arrière (Backspace), on ne fait rien
  // pour lui permettre d'effacer le slash normalement.
  if (event.key === 'Backspace') {
    return;
  }

  // 2. On récupère la valeur actuelle et on enlève tout ce qui n'est pas un chiffre
  let value = patientModal.form.localBirthdate.replace(/\D/g, '');
  let formattedValue = '';

  // 3. On reconstruit la chaîne avec les slashs aux bons endroits
  if (value.length > 0) {
    formattedValue += value.substring(0, 2);
  }
  if (value.length >= 2) {
    formattedValue += '/' + value.substring(2, 4);
  }
  if (value.length >= 4) {
    formattedValue += '/' + value.substring(4, 8);
  }

  // 4. On met à jour la variable réactive
  patientModal.form.localBirthdate = formattedValue;
};


const savePatient = async () => {

  try {
    const payload = {
      ...patientModal.form,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    patientModal.isOpen = false
    msgModal.show('Envoi en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/patient/post', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200)
    {
      emit('patient-updated');
    }
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();patientModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='EMAIL_EXISTS') err = 'Un patient existe déjà avec cet email';
    else if(err==='PHONE_EXISTS') err = 'Un patient existe déjà avec ce numéro de téléphone';
    else if(err==='BAD_MSISDN') err = 'Le numéro de téléphone a un mauvais format. Il doit commencer par 06 ou 07 et avoir 10 chiffres en tout';

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();patientModal.isOpen = true;});
  }
};

</script>


<style scoped>
@import '../../assets/modal.css';
@import '../../assets/views.css';
@import '../../assets/forms.css';
@import '../../assets/tabnav.css';

</style>
