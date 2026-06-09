import {reactive, ref} from 'vue';
import {fetchIdelMgtModalData} from "@/utils/idel.js";

export const idelMgtAptModal = reactive({
    isOpen: false,
    isLoadingData: false,

    form: { pecid:0, idelType: '', aptTs:0 , prettyApt:'', idelUid:0 },
    localIdels: [],

    // Actions pour modifier l'état
    async open(pecid) {
        this.isOpen = true;
        let response = await fetchIdelMgtModalData(pecid);
        idelMgtAptModal.form = response.pec;
        idelMgtAptModal.localIdels = response.localIdels;
        idelMgtAptModal.form.prettyApt = response.pec && response.pec.aptTs?new Date(response.pec.aptTs).toLocaleString("fr-FR").substring(0,16):''
    },

    defaultClose() {
        this.isOpen = false;
    },

});
