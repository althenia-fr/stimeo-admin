<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import {wizardPecForm, wizardPecInitData} from "@/utils/pec-wizard.js";
/*
const form = reactive({
  followUpAptText: '',
  followUpWeeks: 0,
  followUpUid: '',
  durationProtocole: 0,
})*/

//defineExpose({ form });

watch(() => wizardPecForm.durationAndFollowUpDto.followUpWeeks, (newWeeks) => {
  if(newWeeks>0)
  {
    const date = new Date();
    date.setDate(date.getDate() + (newWeeks * 7));
    wizardPecForm.durationAndFollowUpDto.followUpAptText = new Intl.DateTimeFormat('fr-FR').format(date);
  }
  else wizardPecForm.durationAndFollowUpDto.followUpAptText = ''
})

const filteredMembers = computed(() => {
  let res = []
  if(!wizardPecForm.header.onBehalfOf) return res;

  const doctor = wizardPecInitData.doctors?.find(d => d.uid === wizardPecForm.header.onBehalfOf)
  let selfDoctor = {uid:doctor.uid,firstname:doctor.firstname,lastname:doctor.lastname,roleLbael:doctor.roleLbael}

  let visibleTid = wizardPecForm.header.visibleTid;
  if(visibleTid===0)
  {
    res.push(selfDoctor)
    return res;
  }
  else
  {
    let team = doctor.teams?.find(t => t.team.tid === visibleTid)
    if(!team || !team.members || team.members.length===0)
    {
      res.push(selfDoctor)
      return res;
    }
    else
    {
      for(let i = 0; i < team.members.length; i++) {
        let teamMemberIter = team.members[i]
        if([1, 3, 4, 5].includes(teamMemberIter.role)) res.push(teamMemberIter)
      }
      return res;
    }
  }

})

const possibleFollowUpWeeks = computed(() => {
  const min = 1;
  const max = wizardPecForm.durationAndFollowUpDto.durationProtocole;
  let result = [];
  for (let i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
})
</script>

<template>

    <div class="form-group-inline">
      <label>Durée</label>
      <select v-model="wizardPecForm.durationAndFollowUpDto.durationProtocole" class="form-control">
        <option :value="0" disabled>Sélectionner une durée</option>
        <option :value="6">6 semaines</option>
        <option :value="7">7 semaines</option>
        <option :value="8">8 semaines</option>
        <option :value="9">9 semaines</option>
        <option :value="10">10 semaines</option>
        <option :value="11">11 semaines</option>
        <option :value="12">12 semaines</option>
        <option :value="13">13 semaines</option>
        <option :value="14">14 semaines</option>
        <option :value="15">15 semaines</option>
        <option :value="16">16 semaines</option>
        <option :value="17">17 semaines</option>
        <option :value="18">18 semaines</option>
        <option :value="19">19 semaines</option>
        <option :value="20">20 semaines</option>
        <option :value="21">21 semaines</option>
        <option :value="22">22 semaines</option>
        <option :value="23">23 semaines</option>
        <option :value="24">24 semaines</option>
        <option :value="25">25 semaines</option>
        <option :value="26">26 semaines</option>
      </select>
    </div>

    <div class="form-group-inline">
      <label>Patient à revoir dans :</label>
      <select v-model="wizardPecForm.durationAndFollowUpDto.followUpWeeks" class="form-control">
        <option disabled value="">Sélectionner…</option>
        <option :value="0">Pas de suivi</option>
        <option v-for="week in possibleFollowUpWeeks" :key="week" :value="week">
          {{ week }} semaines
        </option>
      </select>
    </div>

    <div class="form-group-inline">
      <label>Sera revu par :</label>
      <select v-model="wizardPecForm.durationAndFollowUpDto.followUpUid" class="form-control">
        <option disabled value="">Sélectionner le professionnel</option>
        <option v-for="m in filteredMembers" :key="m.uid" :value="m.uid">
          {{ m.firstname }} {{ m.lastname }} - {{ m.roleLabel }}
        </option>
      </select>
    </div>

    <div class="form-group-inline">
      <label>RDV de suivi :</label>
      <input type="text" v-model="wizardPecForm.durationAndFollowUpDto.followUpAptText" placeholder="jj/mm/aaaa" class="form-control" />
    </div>

</template>

<style scoped>
@import '@/assets/forms.css';

</style>