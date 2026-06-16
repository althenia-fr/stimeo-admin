import {msgModal} from "@/utils/modals/msg-modal.js";
import {idelMgtAptModal} from "@/utils/modals/idel-mgt-apt-modal.js";
import {idelMgtReviewModal} from "@/utils/modals/idel-mgt-review-modal.js";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {isValidEmail, validatePhoneNumber} from "@/utils/format.js";
import {prettyPrintErrorMsg} from "@/utils/error.js";

export function openModal(pec, onPecUpdateCallback){
    if(!pec.protocol) return;

    if(pec.overallStatus.startsWith('rdv')) idelMgtAptModal.open(pec.pecid);
    else if(pec.overallStatus==='non prescrit')
    {
        msgModal.show('IDEL non prescrit',"Il n'y a pas d'IDEL prescrit pour cette PEC. Voulez-vous continuer et associer un(e) IDEL?", 'Oui, continuer', function(){idelMgtAptModal.open(pec.pecid);},'Annuler',msgModal.defaultClose, true);
    } //returns the list of selectable idels; but no idel linked; user can select one
    else if(pec.overallStatus.indexOf('signer')>-1)
    {
        let msg
            = "Pendant que certains documents sont en attente de signature, l'affectation de l'Idel à la PEC est bloquée. <br/><br/>"
            + "Vous pouvez passer outre l'absence de signature, mais la situation devra être régularisée ultérieurement."

        msgModal.show("Signature en attente",msg, 'Passer outre',function(){msgModal.defaultClose();forceNotSigned(pec,onPecUpdateCallback)},'OK', msgModal.defaultClose,true);
    }
    else if(pec.overallStatus==='à valider') idelMgtReviewModal.open(pec.pecid);
    else if(pec.overallStatus.startsWith('medicalib'))
    {
        //either canceled or pending (allocated handled by 'rdv' use case above)
        //1. if pending, we can cancel
        if(pec.overallStatus.indexOf('pending')>-1)
        {
            msgModal.show('Arrêt Medicalib','Voulez-vous vraiment interrompre la recherche en cours?', 'Oui, interrompre', function(){medicalibCancel(pec)}, 'Non, continuer', msgModal.defaultClose, true);
        }
        //2.if canceled we can allocate manually a new IDEL or restart medicalib
        else if(pec.overallStatus.indexOf('canceled')>-1) doStartOver(pec);

    }
    else if(pec.overallStatus.indexOf('echec')>-1) doStartOver(pec);
}

function doStartOver(pec)
{
    let msg
        = "Il existe certains cas où la recherche d'une Idel est bloquée. "
        + "<br/><br/>Par exemple si une premiere tentative Médicalib a échoué ou si l'IDEL indiqué par le patient n'est pas disponible. "
        + "<br/><br/>Dans ce cas, vous pouvez choisir un(e) autre Idel ou relancer Medicalib."

    msgModal.show("Recherche IDEL bloquée", msg, 'Choisir une Idel', function(){idelMgtAptModal.open(pec.pecid);},'Relancer Medicalib',function(){medicalibStartover(pec);}, false, '#b7AA40');
}

async function forceNotSigned(pec, onPecUpdateCallback)
{
    try {

        const payload = {
            pecid: pec.pecid,
        };

        let admin = storageService.getItem('admin');
        let axiosRequestConfig = {
            headers: {
                'Content-Type':'application/json; charset=utf-8',
                'Authorization': 'Basic ' + admin.secret,
            }
        }

        // 3. Appel POST Axios standard
        msgModal.show('Opération en cours', "Veuillez patienter...");
        const response = await axios.post(API_BASE_URL+'/admin/pec/forceidelsign', payload,axiosRequestConfig);
        msgModal.defaultClose();
        msgModal.show("Succès","On est passé outre l'absence de signature", 'OK', function(){msgModal.defaultClose();window.location.reload();});

        if(onPecUpdateCallback && typeof onPecUpdateCallback ==='function') onPecUpdateCallback(response.data);

    } catch (error) {
        let err = prettyPrintErrorMsg(error.response)
        msgModal.defaultClose();
        msgModal.show("Erreur","On n'a pas pu passer outre l'absence de signature <br/>"+err, 'OK', msgModal.defaultClose);
        console.log("error whilst fetching idel data", error);
    }

}


async function medicalibStartover(pec)
{
    try {

        const payload = {
            pecid: pec.pecid,
        };

        let admin = storageService.getItem('admin');
        let axiosRequestConfig = {
            headers: {
                'Content-Type':'application/json; charset=utf-8',
                'Authorization': 'Basic ' + admin.secret,
            }
        }

        // 3. Appel POST Axios standard
        msgModal.show('Opération en cours', "Veuillez patienter...");
        const response = await axios.post(API_BASE_URL+'/admin/pec/medicalib/start', payload,axiosRequestConfig);
        msgModal.defaultClose();
        msgModal.show("Succès","La recherche Medicalib a été relancée", 'OK', function(){msgModal.defaultClose();window.location.reload();});


    } catch (error) {
        msgModal.defaultClose();
        msgModal.show("Erreur","La recherche Medicalib n'a pas été relancée", 'OK', msgModal.defaultClose);
        console.log("error whilst fetching idel data", error);
    }
}


async function medicalibCancel(pec)
{
    try {

        const payload = {
            pecid: pec.pecid,
        };

        let admin = storageService.getItem('admin');
        let axiosRequestConfig = {
            headers: {
                'Content-Type':'application/json; charset=utf-8',
                'Authorization': 'Basic ' + admin.secret,
            }
        }

        // 3. Appel POST Axios standard
        msgModal.show('Opération en cours', "Veuillez patienter...");
        const response = await axios.post(API_BASE_URL+'/admin/pec/medicalib/cancel', payload,axiosRequestConfig);
        msgModal.defaultClose();
        msgModal.show("Succès","La recherche Medicalib a été annulée", 'OK', function(){msgModal.defaultClose();window.location.reload();});

    } catch (error) {
        msgModal.defaultClose();
        msgModal.show("Erreur","La recherche Medicalib n'a pas été annulée", 'OK', msgModal.defaultClose);
        console.log("error whilst fetching idel data", error);
    }
}



export const fetchIdelMgtModalData = async (pecid) => {
    idelMgtAptModal.isLoadingData = true;
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
        return response.data

    } catch (error) {
        console.log("error whilst fetching idel data", error);
    } finally {
        idelMgtAptModal.isLoadingData = false;
    }
};

export function checkValidIdelForm(form)
{
    let msg;

    if(!form.rpps) return "N° RPPS manquant"
    else if((''+form.rpps).trim().length!==11) return "Le N° RPPS doit contenir 11 chiffres"
    else if(!form.firstname) return "Prénom manquant"
    else if(!form.lastname) return "Nom manquant"

    else if(!form.email) return "Email manquant"
    else if(!isValidEmail(form.email)) return "L'email a un mauvais format"
    else if(!form.mobile) return "N° mobile manquant"
    else if(msg = validatePhoneNumber(form.mobile)) return msg

    else if(!form.address.add1) return "Adresse manquante"
    else if(!form.address.zip) return "Code postal manquant"
    else if(!form.address.city) return "Ville manquante"

    else return null;
}