import {reactive, ref} from 'vue';
import {fetchIdelMgtModalData} from "@/utils/idel.js";
import {idelModal} from "@/utils/modals/idel-modal.js";

export const idelMgtReviewModal = reactive({
    isOpen: false,
    isLoadingData: false,
    pecid: 0,

    // Actions pour modifier l'état
    async open(pecid) {

        let response = await fetchIdelMgtModalData(pecid);
        //idelMgtReviewModal.form = response;

        idelModal.form.uid=response.pec.idelUid?response.pec.idelUid:0
        idelModal.form.firstname = response.pec.idelFirstname
        idelModal.form.lastname = response.pec.idelLastname
        idelModal.form.email = response.pec.idelEmail
        idelModal.form.mobile = response.pec.idelPhone

        idelMgtReviewModal.pecid = pecid;
        idelMgtReviewModal.isOpen = true;
    },

    defaultClose() {
        idelMgtReviewModal.isOpen = false;
    },

});
