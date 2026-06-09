<template>

  <!-- Navigation des onglets -->
  <div class="tabs-nav">
    <button type="button" :class="{ active: idelModal.activeTab === 'identity' }" @click="idelModal.activeTab = 'identity'">Identité</button>
    <button type="button" :class="{ active: idelModal.activeTab === 'contact' }" @click="idelModal.activeTab = 'contact'">Contact</button>
    <button type="button" :class="{ active: idelModal.activeTab === 'address' }" @click="idelModal.activeTab = 'address'">Adresse</button>
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

    <!-- Tab 3 Address -->
    <div v-show="idelModal.activeTab === 'address'">

      <div class="form-group">
        <label>N° + Voie</label>
        <input type="text" v-model="idelModal.form.address.add1" class="form-control" />
      </div>
      <div class="form-group">
        <label>Complément d'Adresse</label>
        <input type="text" v-model="idelModal.form.address.add2" class="form-control" />
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

    </div>
  </div>

  <div class="modal-footer">
    <button type="submit" class="btn btn-primary" style="float: right" >Enregistrer</button>
    <button type="button" class="btn btn-secondary" style="float: right; margin-right: 15px" @click="function(){emit('cancel')}">Annuler</button>
  </div>


</template>
<script setup>
import {idelModal} from "@/utils/modals/idel-modal.js";

const emit = defineEmits(['cancel']);

</script>

<style scoped>
@import '../assets/modal.css';
@import '../assets/views.css';
@import '../assets/forms.css';
@import '../assets/tabnav.css';

.form-group {
  margin-bottom: 15px;
}

</style>