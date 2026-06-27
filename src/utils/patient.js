import {ref} from "vue";
import {storageService} from "@/utils/storage.js";
import {msgModal} from "@/utils/modals/msg-modal.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {isoToLocalDate, localeToIsoDate, mobile2msisdn, msisdn2mobile} from "@/utils/format.js";
import router from "@/router/router.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";

export let initPatientData = {user:{},patient:{},personalAddress:{},deliveryAddress:{}};
export const patientData = ref(initPatientData);

export const fetchPatientData = async (uid) => {

    patientData.value = initPatientData
    if(uid==0) return;

    //isLoading.value = true;
    try {
        const admin = storageService.getItem('admin');
        msgModal.show('Opération en cours', "Veuillez patienter...");
        const response = await axios.get(`${API_BASE_URL}/admin/patient/get?uid=${uid}`, {
            headers: { 'Authorization': 'Basic ' + admin.secret }
        });

        refreshReactiveFormForVisualFeedback(response.data);

    } catch (error) {
        console.error("Erreur chargement fiche:", error);
    } finally {
        msgModal.defaultClose()
    }
};

export function refreshReactiveFormForVisualFeedback(jsonPatient)
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

export const savePatient = async () => {

    if(patientData.value.user.mobile) patientData.value.user.msisdn = mobile2msisdn(patientData.value.user.mobile)
    if(patientData.value.patient.localeBirthdate) patientData.value.patient.birthdate = localeToIsoDate(patientData.value.patient.localeBirthdate)
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