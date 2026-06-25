<template>
  <Transition name="fade">
    <div v-if="pecResultModal.isOpen" class="modal-overlay" @click.self="pecResultModal.defaultClose()">

        <div class="modal-content relative bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-[90%] p-5">

            <h3 class="text-lg font-semibold mb-2">Nouvelle Prise en Charge</h3>
            <p class="text-sm text-gray-600">
              La Prise en Charge a été créée avec succès.
              {{pecResultModal.prescriptionUrl!=null?"Vous devez à présent signer l'ordonnance":""}}
              {{pecResultModal.prescriptionUrl!=null && pecResultModal.idelPrescriptionUrl!=null?" et l'ordonnance IDEL.":"."}}
              {{pecResultModal.prescriptionUrl==null && pecResultModal.idelPrescriptionUrl!=null?"Vous devez à présent signer l'ordonnance l'ordonnance IDEL.":""}}
            </p>

          <div class="mt-4 flex flex-col items-center gap-3 mb-4">

            <div v-if="pecResultModal.prescriptionUrl">
              <button @click="openNewTab(pecResultModal.prescriptionUrl)"
                      class="mt-2 px-4 py-1 rounded bg-gold hover:bg-darkgold hover:text-white text-gray-600 font-medium shadow-md transition-all ">
                <font-awesome-icon icon="fa-solid fa-signature"/> Signer l'ordonnance
              </button>
            </div>

            <div v-if="pecResultModal.idelPrescriptionUrl">
              <button
                  @click="openNewTab(pecResultModal.idelPrescriptionUrl)"
                  class="mt-2 px-4 py-1 rounded bg-gold hover:bg-darkgold hover:text-white text-gray-600 font-medium shadow-md transition-all "
              >
                <font-awesome-icon icon="fa-solid fa-signature"/> Signer l'ordonnance IDEL
              </button>
            </div>

          </div>


          <p class="text-xs text-gray-400">
            Vous pouvez signer plus tard en consultant les documents de la Prise en Charge.
          </p>

          <hr class="mt-2"/>

          <button  style="margin-right: 15px"
                   @click="pecResultModal.defaultClose();router.push('/pecs');"
                   class="mt-2 px-4 py-1 rounded bg-gray-200 hover:bg-gray-500 hover:text-white text-gray-600 font-medium shadow-md transition-all float-right"
          >
            Annuler
          </button>

        </div>

    </div>
  </Transition>
</template>

<script setup>
import {pecResultModal} from "@/stores/modal/pecresult-modal.js";
import router from "@/router/index.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

 function openNewTab(url)
 {
   window.open(url,'_blank','noopener');
 }


</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
}
.modal-content {
  background: white; padding: 1rem; border-radius: 12px;
  min-width: 300px;
}


</style>