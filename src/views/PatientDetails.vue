<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">
          <font-awesome-icon @click="goBack" class="clickable" icon="fa-solid fa-arrow-left-long"/>
          Patient {{patientData.user?.lastname}} {{patientData.user?.firstname}}
        </h2>
        <p class="subtitle">Fiche patient détaillée</p>
      </div>
      <button class="btn btn-primary" @click="savePatient">Enregistrer</button>
    </div>

    <div class="tabs-nav">
      <button :class="{ active: currentTab === 'ID' }" @click="currentTab = 'ID'">Info. Personnelles</button>
      <button :class="{ active: currentTab === 'Payee' }" @click="currentTab = 'Payee'">Tiers-Payant</button>
      <button :class="{ active: currentTab === 'Entourage' }" @click="currentTab = 'Entourage'">Entourage</button>
      <button :class="{ active: currentTab === 'Pecs' }" @click="currentTab = 'Pecs'">Prise(s) en Charge</button>
      <button :class="{ active: currentTab === 'Misc' }" @click="currentTab = 'Misc'">Divers</button>

      <!--button>Devis / Bon / Facture</button>
      <button :class="{ active: currentTab === 'Locations' }" @click="currentTab = 'Locations'">Locations</button>
      <button>Document</button>
      <button>Notes</button>
      <button>Visites</button-->
    </div>

    <div class="tabs-content">
      <component :is="activeTabComponent"  />
    </div>

  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from "@/router/router.js";
import PatientDetailsID from "@/components/PatientDetailsTabs/PatientDetailsID.vue";
import PatientDetailsPayee from "@/components/PatientDetailsTabs/PatientDetailsPayee.vue";
import PatientDetailsMisc from "@/components/PatientDetailsTabs/PatientDetailsMisc.vue";
import PatientDetailsEntourage from "@/components/PatientDetailsTabs/PatientDetailsEntourage.vue";
import PatientDetailsPecs from "@/components/PatientDetailsTabs/PatientDetailsPecs.vue";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import {initPatientData, patientData} from "@/utils/patient.js";
import {isoToLocalDate, localeToIsoDate, mobile2msisdn, msisdn2mobile} from "@/utils/format.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";


const currentTab = ref('ID');
const goBack = () => router.back();

const activeTabComponent = computed(() => {
  if (currentTab.value === 'Payee') return PatientDetailsPayee;
  if (currentTab.value === 'Entourage') return PatientDetailsEntourage;
  if (currentTab.value === 'Pecs') return PatientDetailsPecs;
  if (currentTab.value === 'Misc') return PatientDetailsMisc;
  else return PatientDetailsID; //default

});

const props = defineProps({
  uid: String,
});

//const patient = ref({});

const fetchPatientData = async () => {

  patientData.value = initPatientData
  if(props.uid==0) return;

  //isLoading.value = true;
  try {
    const admin = storageService.getItem('admin');
    msgModal.show('Opération en cours', "Veuillez patienter...");
    const response = await axios.get(`${API_BASE_URL}/admin/patient/get?uid=${props.uid}`, {
      headers: { 'Authorization': 'Basic ' + admin.secret }
    });

    refreshReactiveFormForVisualFeedback(response.data);

  } catch (error) {
    console.error("Erreur chargement fiche:", error);
  } finally {
    msgModal.defaultClose()
  }
};

function refreshReactiveFormForVisualFeedback(jsonPatient)
{
  //JSON.parse/stringify permet de cloner
  let deepcopy = JSON.parse(JSON.stringify(jsonPatient))
  if(deepcopy.patient?.birthdate) deepcopy.patient.localeBirthdate = isoToLocalDate(deepcopy.patient.birthdate)
  if(deepcopy.patient?.deathdate) deepcopy.patient.localeDeathdate = isoToLocalDate(deepcopy.patient.deathdate)
  if(deepcopy.user?.msisdn) deepcopy.user.mobile = msisdn2mobile(deepcopy.user.msisdn)
  if(!deepcopy.personalAddress) deepcopy.personalAddress={}
  if(!deepcopy.deliveryAddress) deepcopy.deliveryAddress={}
  patientData.value = deepcopy
}

const savePatient = async () => {

  patientData.value.user.msisdn = mobile2msisdn(patientData.value.user.mobile)
  patientData.value.patient.birthdate = localeToIsoDate(patientData.value.patient.localeBirthdate)
  if(patientData.value.patient.localeDeathdate) patientData.value.patient.deathdate = localeToIsoDate(patientData.value.patient.localeDeathdate)

  try {
    const payload = {
      ...patientData.value,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    msgModal.show('Envoi en cours', "Veuillez patienter...");
    let isNewProfile = !(patientData.value.user.uid)
    const response = await axios.post(API_BASE_URL+'/admin/patient/post', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status!==200) msgModal.show('Erreur', "code "+response.status, 'OK',msgModal.defaultClose);
    else
    {
      msgModal.show('Succès', 'Le profile Patient '+patientData.value.user.lastname+' '+patientData.value.user.firstname+' a bien été sauvegardé.', 'OK',msgModal.defaultClose);
      refreshReactiveFormForVisualFeedback(response.data);
      if(isNewProfile)
      {
        let newUid = patientData.value.user.uid
        router.push({
          name: 'patient',
          params: { uid: newUid },
          replace: true
        });
      }
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    console.error("Erreur:",err );
    if(err==='EMAIL_EXISTS') err = 'Un patient existe déjà avec cet email';
    else if(err==='PHONE_EXISTS') err = 'Un patient existe déjà avec ce numéro de téléphone';
    else if(err==='NIR_EXISTS') err = 'Un patient existe déjà avec ce numéro de sécurité sociale';
    else if(err==='BAD_MSISDN') err = 'Le numéro de téléphone a un mauvais format. Il doit commencer par 06 ou 07 et avoir 10 chiffres en tout';

    msgModal.show('Erreur', err, 'OK',msgModal.defaultClose);
  }
};


onMounted(fetchPatientData);

</script>

<style scoped>
@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/tabnav.css';
</style>