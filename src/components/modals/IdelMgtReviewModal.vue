<template>
  <Transition name="modal-fade">
    <div v-if="idelMgtReviewModal.isOpen && !idelMgtReviewModal.isLoadingData" class="modal-overlay" @click.self="idelMgtReviewModal.defaultClose">
      <div class="modal-content">
        <div class="modal-header">
          <h3>IDEL à valider</h3>
        </div>

        <form @submit.prevent="saveIdel">

          <IdelForm @cancel="idelMgtReviewModal.defaultClose" />

        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>

import {idelMgtReviewModal} from "@/utils/modals/idel-mgt-review-modal.js";
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";
import IdelForm from "@/components/IdelForm.vue";
import {checkValidIdelForm} from "@/utils/idel.js";
import {idelModal} from "@/utils/modals/idel-modal.js";

const emit = defineEmits(['pec-updated']);

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
      pecid: idelMgtReviewModal.pecid,
    };

    let admin = storageService.getItem('admin');
    let axiosRequestConfig = {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Authorization': 'Basic ' + admin.secret,
      }
    }

    // 3. Appel POST Axios standard
    idelMgtReviewModal.isOpen = false
    msgModal.show('Envoi en cours', "Veuillez patienter...");
    const response = await axios.post(API_BASE_URL+'/admin/idel/review', payload,axiosRequestConfig);
    msgModal.defaultClose();

    if(response.status===200) emit('pec-updated', idelMgtReviewModal.pecid);
    else
    {
      msgModal.show('Erreur', "code "+response.status, 'OK',function(){msgModal.defaultClose();idelMgtReviewModal.isOpen = true;});
    }

  } catch (error) {
    let err = prettyPrintErrorMsg(error.response)
    if(err==='DATE_BAD_FORMAT') err = "La date du RDV n'est pas au format JJ/MM/AAAA hh:mm:ss";

    msgModal.show('Erreur', err, 'OK',function(){msgModal.defaultClose();idelMgtReviewModal.isOpen = true;});
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
