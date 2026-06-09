import {msgModal} from "@/utils/modals/msg-modal.js";
import {idelMgtAptModal} from "@/utils/modals/idel-mgt-apt-modal.js";
import {idelMgtReviewModal} from "@/utils/modals/idel-mgt-review-modal.js";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";
import {isValidEmail, validatePhoneNumber} from "@/utils/format.js";

export function openModal(pec){
    if(!pec.protocol) return;

    if(pec.idelStatus.startsWith('rdv')) idelMgtAptModal.open(pec.pecid);
    else if(pec.idelStatus==='non prescrit')
    {
        msgModal.show('IDEL non prescrit',"Il n'y a pas d'IDEL prescrit pour cette PEC. Voulez-vous continuer et associer un(e) IDEL?", 'Oui, continuer', function(){idelMgtAptModal.open(pec.pecid);},'Annuler',msgModal.defaultClose, true);
    } //returns the list of selectable idels; but no idel linked; user can select one
    else if(pec.idelStatus==='à valider') idelMgtReviewModal.open(pec.pecid);
    else if(pec.idelStatus.startsWith('medicalib'))
    {
        //either canceled or pending (allocated handled by 'rdv' use case above)
        //1. if pending, we can cancel
        if(pec.idelStatus.indexOf('pending'))
        {
            msgModal.show('Arrêt Medicalib','Voulez-vous vraiment interrompre la recherche en cours?', 'Oui, interrompre', function(){medicalibCancel(pec)}, 'Non, continuer', msgModal.defaultClose, true);
        }
        //2.if canceled we can allocate manually a new IDEL or restart medicalib
        else if(pec.idelStatus.indexOf('canceled')) doStartOver(pec);
    }
    else if(pec.idelStatus.indexOf('echec')>-1) doStartOver(pec);
}

function doStartOver(pec)
{
    msgModal.show("Recherche d'IDEL","Voulez-vous choisir un(e) IDEL ou relancer Medicalib?", 'Choisir', function(){idelMgtAptModal.open(pec.pecid);},'Medicalib',function(){medicalibStartover(pec);}, false, '#b7AA40');
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