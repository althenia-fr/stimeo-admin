import {ref} from "vue";

export let initPatientData = {user:{},patient:{},personalAddress:{},deliveryAddress:{}};
export const patientData = ref(initPatientData);