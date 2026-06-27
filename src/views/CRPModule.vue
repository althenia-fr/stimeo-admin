<script setup>
import { ref } from 'vue'
import CRPCalendarDashboard from './CRPCalendarDashboard.vue'
import CRPCallSheet from './CRPCallSheet.vue'

const currentView = ref('calendar') // 'calendar' ou 'sheet'
const activeCallId = ref(0)

function openCall(id) {
  activeCallId.value = id
  currentView.value = 'sheet'
}

function closeCall() {
  currentView.value = 'calendar'
}
</script>

<template>
  <CRPCalendarDashboard v-if="currentView === 'calendar'" @open-call-sheet="openCall" />
  <CRPCallSheet v-else :callId="activeCallId" @close-call-sheet="closeCall" />
</template>