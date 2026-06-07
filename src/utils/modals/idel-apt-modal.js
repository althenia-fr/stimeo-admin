import {reactive, ref} from 'vue';
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";

export const idelAptModal = reactive({
    isOpen: false,
    isLoadingData: false,

    form: { pecid:0, idelType: '',idelCity: '', idelEmail:'', idelFirstname:'',  idelLastname:'', idelPhone:'', medicalibStatus:'',
        patientHasOwnIdel: false, status: '', aptTs:0 , prettyApt:''},

    // Actions pour modifier l'état
    show() {
        this.isOpen = true;
    },

    defaultClose() {
        this.isOpen = false;
    },

    openModal(pec){
        if(!canOpenIdelAptModal(pec)) return;
        fetchIdelAptModalData(pec.pecid)
        idelAptModal.isOpen = true;
    },

});

export function canOpenIdelAptModal(pec) {
    if(pec.idelStatus==='n/a' || pec.idelStatus==='??' || pec.idelStatus==='non prescrit' || pec.idelStatus==='erreur') return false;
    else  return true;
}

const fetchIdelAptModalData = async (pecid) => {
    idelAptModal.isLoadingData = true;
    try {
        let admin = storageService.getItem('admin');
        let axiosRequestConfig = {
            headers: {
                'Content-Type':'application/json; charset=utf-8',
                'Authorization': 'Basic ' + admin.secret,
            }
        }
        msgModal.show('Initialisation en cours', "Veuillez patienter...");
        const response = await axios.get(API_BASE_URL+'/admin/pec/idel/get?pecid='+pecid,axiosRequestConfig);
        msgModal.defaultClose();
        idelAptModal.form = response.data;
        idelAptModal.form.prettyApt = response.data.aptTs?new Date(response.data.aptTs).toLocaleString("fr-FR").substring(0,16):''

    } catch (error) {
        console.log("error whilst fetching idel data", error);
    } finally {
        idelAptModal.isLoadingData = false;
    }
};