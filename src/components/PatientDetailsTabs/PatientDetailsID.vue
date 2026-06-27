<template>

  <div class="tabs-content">

      <div class="card-grid-2x">

        <div class="info-card">
          <h3 class="card-title">État Civil  <span class="required-star">*</span></h3>
          <div class="form-group-inline"><label>Civilité</label>
            <select  v-model="patientData.patient.gender" class="form-control">
              <option :value=0 disabled>Choisissez...</option>
              <option :value=1>Monsieur</option>
              <option :value=2>Madame</option>
            </select>

          </div>
          <div class="form-group-inline"><label>Nom</label><input type="text" class="form-control" v-model="patientData.user.lastname" /></div>
          <div class="form-group-inline"><label>Prénom</label><input type="text" class="form-control" v-model="patientData.user.firstname" /></div>
          <div class="form-group-inline"><label>Né(e) le</label><input type="text" placeholder="JJ/MM/AAAA" class="form-control" @keyup="formatDate($event,patientData.patient,'localeBirthdate')" v-model="patientData.patient.localeBirthdate" /></div>
        </div>

        <div class="info-card">
          <h3 class="card-title">Coordonnées  <span class="required-star">*</span></h3>
          <div class="form-group-inline"><label>Mobile</label><input type="text" class="form-control" v-model="patientData.user.mobile"/></div>
          <div class="form-group-inline"><label>Email</label><input type="email" class="form-control" v-model="patientData.user.email"/></div>
        </div>

        <div class="info-card">
          <h3 class="card-title">Adresse personnelle  <span class="required-star">*</span></h3>
          <div class="form-group-inline"><label>Adresse</label><input type="text" class="form-control" v-model="patientData.personalAddress.add1" /></div>
          <div class="form-group-inline"><label>Complément</label><input type="text" class="form-control" v-model="patientData.personalAddress.add2"  /></div>
          <div class="form-group-inline"><label>Code Postal</label><input type="text" class="form-control" v-model="patientData.personalAddress.zip"  /></div>
          <div class="form-group-inline"><label>Ville</label><input type="text" class="form-control" v-model="patientData.personalAddress.city"  /></div>
          <div class="form-group-inline" v-if="patientData.personalAddress.latitude && patientData.personalAddress.longitude"><label>Lat.</label><input type="text" class="form-control" v-model="patientData.personalAddress.latitude"  disabled/></div>
          <div class="form-group-inline" v-if="patientData.personalAddress.latitude && patientData.personalAddress.longitude"><label>Long.</label><input type="text" class="form-control" v-model="patientData.personalAddress.longitude"  disabled/></div>
        </div>

        <div class="info-card">
          <h3 class="card-title">Adresse de livraison</h3>
          <div class="form-group-inline"><label>Adresse</label><input type="text" class="form-control" v-model="patientData.deliveryAddress.add1" /></div>
          <div class="form-group-inline"><label>Complément</label><input type="text" class="form-control" v-model="patientData.deliveryAddress.add2"  /></div>
          <div class="form-group-inline"><label>Code Postal</label><input type="text" class="form-control" v-model="patientData.deliveryAddress.zip"  /></div>
          <div class="form-group-inline"><label>Ville</label><input type="text" class="form-control" v-model="patientData.deliveryAddress.city"  /></div>
          <div class="form-group-inline" v-if="patientData.deliveryAddress.latitude && patientData.deliveryAddress.longitude"><label>Lat.</label><input type="text" class="form-control" v-model="patientData.deliveryAddress.latitude"  disabled/></div>
          <div class="form-group-inline" v-if="patientData.deliveryAddress.latitude && patientData.deliveryAddress.longitude"><label>Long.</label><input type="text" class="form-control" v-model="patientData.deliveryAddress.longitude"  disabled/></div>
        </div>
      </div>


  </div>


</template>

<script setup>

import {patientData} from "@/utils/patient.js";
import {formatDate} from "@/utils/format.js";


</script>

<style scoped>
@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/card.css';

</style>