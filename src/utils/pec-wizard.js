import {reactive} from "vue";
import {storageService} from "@/utils/storage.js";
import axios from "axios";
import {API_BASE_URL} from "@/utils/http.js";

export const wizardPecInitData = reactive({})

let admin = storageService.getItem('admin');

export const wizardPecForm = reactive({

    protocol : 0 ,
    header :{
        patientUid: 0,
        authorUid: admin?.uid,
        visibleTid: null,
        onBehalfOf: 0,
    },

    prescriptionPicker :{
        validity: '1 mois',
        renewal: '11 fois',
        prescDate: formatToday(),
        prescriptionItems: [],
        uploadPrescription: [],
        uploadFilename: null,
    },
    durationAndFollowUpDto : {
        followUpWeeks : null,
        durationProtocole : null,
        followUpAptText: null ,
        followUpUid: null,
    },
    protocolTensUro : {
        seancesQuotidiennes: 1,
        dureeSeance: 20,
        uro: {
            indication: null,
            mictions: 0,
            urgenturies: 0,
            mic_nocturnes: 0,
            urg_nocturnes: 0,
            fuites: 0,
            protections: 0,
            douleur: 0,
            objectifs: []
        },

        origineNeurologique: null,

        uspEnabled: null,
        calendrierMictionnelEnabled: null,

        assessmentStartWeeks: null,
        assessmentFrequency: null,

        apneeSommeil: null,
        apneeAppareille: null,
        apneeExamenEnvisage: null,
        apneeExamenDate: null,
        apneeAccompagnementSouhaite: null,

        commentaireProtocole: '',
    },
    formsForAllProtocols : {
        patientSatisfactionEnabled: true,
        pgiIEnabled: true,
        sfQualiveenEnabled: true,
    },
    idelOptions : {
        idelNeeded: false,
        idelKnown: false,
        idelNurseName: '',
        idelNurseEmail: '',
        idelNursePhone: '',
        idelNurseCity: '',
        stimeoMayCaterFor: false,
        patientAvailableOn: {timeslot: 'Toute la journée', days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']},
        idelNoteFromDoctor: ''
    }
})

export function checkDataPatient(substep)
{
    if(!wizardPecForm.header.patientUid) return "Patient à renseigner"
}

export function checkDataDoctor(substep)
{
    if(!wizardPecForm.header.onBehalfOf) return "Docteur à renseigner"
    else if(wizardPecForm.header.visibleTid===null) return "Facturation à renseigner"
}

export function checkDataProtocol(substep){

    if(wizardPecForm.protocol>0)
    {
        if(!wizardPecForm.durationAndFollowUpDto.durationProtocole) return "Durée du Protocole à renseigner"
        else if(wizardPecForm.durationAndFollowUpDto.followUpWeeks===null) return "Champ 'Patient à revoir dans X semaines' à renseigner"
    }
}

export function checkDataUro(substep){

    if(substep===1)
    {
        if(wizardPecForm.protocolTensUro.origineNeurologique===null) return "Origine du trouble à renseigner"
        else if(wizardPecForm.protocolTensUro.uro.indication===null) return "Indication thérapeutique à renseigner"
    }
    else if(substep===3)
    {
        if(!wizardPecForm.protocolTensUro.dureeSeance) return "Durée séance à renseigner"
        else if(!wizardPecForm.protocolTensUro.seancesQuotidiennes) return "Nombre de séances quotidiennes à renseigner"
    }
    else if(substep===4)
    {
        if(wizardPecForm.protocolTensUro.assessmentFrequency===null) return "Fréquence d'évaluation à renseigner"
        else if(wizardPecForm.protocolTensUro.assessmentStartWeeks===null) return "Démarrage à renseigner"
    }
    else if(substep===5)
    {
        if(wizardPecForm.protocolTensUro.uspEnabled===null) return "USP à renseigner"
        else if(wizardPecForm.protocolTensUro.calendrierMictionnelEnabled===null) return "Calendrier mictionnel à renseigner"
    }
    else if(substep===6)
    {
        if(wizardPecForm.protocolTensUro.apneeSommeil===null) return "Apnée du sommeil à renseigner"
    }

}

export function checkDataPrescription(substep){

    if(wizardPecForm.prescriptionPicker.prescriptionItems.length>0)
    {
        for(let i=0;i<wizardPecForm.prescriptionPicker.prescriptionItems.length;i++)
        {
            let prescriptionItem = wizardPecForm.prescriptionPicker.prescriptionItems[i]
            if(prescriptionItem.qty===null) return "Quantité à renseigner pour l'article "+prescriptionItem.label
            else if(prescriptionItem.unit===null) return "Unité à renseigner pour l'article "+prescriptionItem.label
        }
    }
}

export function checkDataIdel(substep)
{
    if(wizardPecForm.idelOptions.idelNeeded)
    {
        if(wizardPecForm.idelOptions.idelKnown===false && !wizardPecForm.idelOptions.stimeoMayCaterFor) return "Le patient doit autoriser Stimeo à envoyer un(e) Idel ou renseigner son/sa propre IDEL."
    }
}


function formatToday() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}


export const fetchAutocomplete = async (query,medicalBase,controller) => {

    try {
        let encodedQuery = encodeURIComponent(query)

        let admin = storageService.getItem('admin');
        let axiosRequestConfig = {
            headers: {
                'Content-Type':'application/json; charset=utf-8',
                'Authorization': 'Basic ' + admin?.secret,
            },
            signal:controller.signal
        }
        const response = await axios.get(API_BASE_URL+'/autocomplete?query='+encodedQuery+'&base='+medicalBase,axiosRequestConfig);
        return response.data

    } catch (error) {
        if(error.message==='canceled')  console.log("requete canceled");
        throw error
    }
};