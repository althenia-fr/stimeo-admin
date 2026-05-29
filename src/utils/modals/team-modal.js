import {reactive} from 'vue';

export const teamModal = reactive({
    teams: [],
    isOpen: false,
    isEditing : false,
    form: { tid: null,  name: '',  etablissement: null, service: '' , delegate: null },

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
        this.form =  { tid: null,  name: '',  etablissement: null, service: '' , delegate: null },
        teamModal.isOpen = true;
    },

    openEditModal(team){
        this.isEditing = true;
        // On clone l'objet pour ne pas modifier le tableau en temps réel
        this.form = { ...team };
        teamModal.isOpen = true;
    },

});

