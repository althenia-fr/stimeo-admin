import {reactive} from 'vue';

export const idelModal = reactive({
    isOpen: false,
    isEditing : false,
    activeTab : 'identity',
    form: { uid: null,  lastname: '',  firstname: '', email: '', mobile: '' , rpps:'', address:{}},

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
        this.activeTab = 'identity';
        this.editIndex = -1;
        this.form = { uid: null, lastname: '', firstname: '', email: '', mobile: '' , rpps:'', address:{}};
        idelModal.isOpen = true;
    },

    openEditModal(idel){
        this.isEditing = true;
        this.activeTab = 'identity';
        // On clone l'objet pour ne pas modifier le tableau en temps réel
        this.form = { ...idel};
        idelModal.isOpen = true;
    },

});

