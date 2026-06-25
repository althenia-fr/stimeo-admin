import { reactive } from 'vue';

export const pecResultModal = reactive({

    isOpen: false,
    idelPrescriptionUrl: null,
    prescriptionUrl: null ,

    show(prescriptionUrl, idelPrescriptionUrl) {
        this.prescriptionUrl = prescriptionUrl;
        this.idelPrescriptionUrl = idelPrescriptionUrl;
        this.isOpen = true;
    },

    defaultClose() {
        this.idelPrescriptionUrl = null;
        this.prescriptionUrl = null;
        this.isOpen = false;
    }

});