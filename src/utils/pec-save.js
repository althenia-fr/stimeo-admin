import {msgModal} from "@/utils/modals/msg-modal.js";
import {wizardPecForm} from "@/utils/pec-wizard.js";
import {ref} from "vue";
import router from "@/router/router.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {storageService} from "@/utils/storage.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";

export const isSaving = ref(false)

let statusTimeout = null

async function updateStatus()
{
    try {
        let admin = storageService.getItem('admin');
        let axiosRequestConfig = {
            headers: {
                'Content-Type':'application/json; charset=utf-8',
                'Authorization': 'Basic ' + admin.secret,
            }
        }

        const response = await axios.get(API_BASE_URL+'/pec/status',axiosRequestConfig);
        let msg = ''

        for(let i=0;i<response.data.length;i++)
        {
            msg += response.data[i]
            if(i<response.data.length-1) msg += "&nbsp;&nbsp;&nbsp;<span style='float: right'>&#x2705;</span>";
            msg += '<br/>'
        }

        if (statusTimeout)
        {
            msgModal.updateMsg(msg);
            //start monitoring the status of the PEC creation
            clearTimeout(statusTimeout)
            statusTimeout = setTimeout(() => {
                updateStatus()
            }, 1000)
        }

    } catch (error) {
        console.log("error whilst fetching pec status", error);
    }

}

function workoutDoc(pec, docType) {
    if(!pec.docs) return null;
    else {
        for(let i=0;i<pec.docs.length;i++)
        {
            let doc = pec.docs[i]
            if(doc.docType===docType) return doc
        }
        return null;
    }
}

export async function submitPec() {

    isSaving.value = true;

    try {
        msgModal.show('Patientez', 'Création de la PEC en cours', null, () => { }, null, () => { }, false);

        //start monitoring the status of the PEC creation
        if (statusTimeout) clearTimeout(statusTimeout)
        statusTimeout = setTimeout(() => {
            updateStatus()
        }, 1000)

        let admin = storageService.getItem('admin');
        let axiosRequestConfig = {
            headers: {
                'Content-Type':'application/json; charset=utf-8',
                'Authorization': 'Basic ' + admin.secret,
            }
        }

        const response = await axios.post(API_BASE_URL+'/pec/create', wizardPecForm,axiosRequestConfig);

        let newPec = response.data.newPec

        msgModal.defaultClose() //close wait modal

        if (statusTimeout) clearTimeout(statusTimeout)
        statusTimeout = null

        let prescription = workoutDoc(newPec,2);
        let prescriptionIdel = workoutDoc(newPec,4);

        if(wizardPecForm.header.authorUid===wizardPecForm.header.onBehalfOf) pecResultModal.show(prescription?.party1SignatureUrl,prescriptionIdel?.party1SignatureUrl);
        else
        {
            let bothPrescriptions = prescription?.party1SignatureUrl && prescriptionIdel?.party1SignatureUrl
            let onlyPrescription = prescription?.party1SignatureUrl && !prescriptionIdel?.party1SignatureUrl
            let onlyPrescriptionIdel = !prescription?.party1SignatureUrl && prescriptionIdel?.party1SignatureUrl

            let drName = "";
            if(newPec.docs && newPec.docs.length>0) drName = newPec.docs[0].party1Name

            let msg = "La prise en charge a été créée. "
            if(bothPrescriptions) msg += "L'ordonnance et l'ordonnance IDEL ont été envoyées par mail au "+drName+" pour signature";
            else if(onlyPrescription) msg += "L'ordonnance a été envoyée par mail au "+drName+" pour signature";
            else if(onlyPrescriptionIdel) msg += "L'ordonnance IDEL a été envoyée par mail au "+drName+" pour signature";

            msgModal.show('Succès', msg, 'OK',msgModal.defaultClose);
        }

        router.back()

    } catch (error) {

        if (statusTimeout) clearTimeout(statusTimeout)
        statusTimeout = null

        msgModal.defaultClose()

        let err = error.response?prettyPrintErrorMsg(error.response):error.message
        console.error("Erreur:",err );
        msgModal.show('Erreur', err, 'OK',msgModal.defaultClose);

    }
    finally {
        isSaving.value = false;
    }

}
