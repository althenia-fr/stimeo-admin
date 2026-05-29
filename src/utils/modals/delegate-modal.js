import {reactive} from 'vue';

export const delegateModal = reactive({
    delegates: [],
    isOpen: false,
    isEditing : false,
    form: { uid: null,  lastname: '',  firstname: '', email: '', mobile: '',  password: '' },

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
        this.form = { uid: null, lastname: '', firstname: '', email: '', mobile: '', password: '' };
        delegateModal.isOpen = true;
    },

    openEditModal(delegate){
        this.isEditing = true;
        // On clone l'objet pour ne pas modifier le tableau en temps réel
        this.form = { ...delegate, password: '' };
        delegateModal.isOpen = true;
    },

});

