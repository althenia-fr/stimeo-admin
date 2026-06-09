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
        msgModal.show('Gestion Medicalib','modal à faire', 'OK', msgModal.defaultClose);
    }
    //else if(pec.idelStatus.indexOf('echec')>-1) idelStartModal.open(pec.pecid);

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