import {reactive} from 'vue';

export const siteModal = reactive({
    sites: [],
    isOpen: false,
    isEditing : false,
    form: { sid: null,  finess: '',  etablissement: '', address1: '', address2: '',  postcode: '',  city: '',  phone: '' },

    // Actions pour modifier l'état
    show() {
        this.isOpen = true;
    },

    defaultClose() {
        this.isOpen = false;
    },

    // Ouvre la modale en mode Création
    openAddModal(){
        this.isEditing = false;
        this.editIndex = -1;
        this.form =  { sid: null,  finess: '',  etablissement: '', address1: '', address2: '',  postcode: '',  city: '',  phone: '' };
        siteModal.isOpen = true;
    },

    openEditModal(site){
        this.isEditing = true;
        // On clone l'objet pour ne pas modifier le tableau en temps réel
        this.form = { ...site };
        siteModal.isOpen = true;
    },

});

