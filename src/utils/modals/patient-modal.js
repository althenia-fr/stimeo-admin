import {reactive, ref} from 'vue';

export const patientModal = reactive({
    patients: [],
    isOpen: false,
    isEditing : false,
    activeTab : 'identity',
    form: { uid: null,  nir:'', gender:0, lastname: '', localBirthdate:'', firstname: '', email: '', mobile: '', address:{}, helper:{} },

    // Actions pour modifier l'état
    show() {
        this.isOpen = true;
    },

    defaultClose() {
        this.isOpen = false;
    },

    // Ouvre la modale en mode Création
    openAddModal(){
        this.activeTab = 'identity';
        this.isEditing = false;
        this.editIndex = -1;
        this.form = { uid: null,  nir:'', gender:0, lastname: '', localBirthdate:'', firstname: '', email: '', mobile: '', address:{}, helper:{} };
        patientModal.isOpen = true;
    },

    openEditModal(patient){
        this.activeTab = 'identity';
        this.isEditing = true;
        // On clone l'objet pour ne pas modifier le tableau en temps réel
        this.form = { ...patient };
        patientModal.isOpen = true;
    },

});

