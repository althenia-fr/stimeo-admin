<template>
  <Transition name="modal-fade">
    <div v-if="msgModal.isOpen" class="modal-overlay" @click.self="msgModal.defaultClose()">

      <div class="modal-content">
        <h3>{{ msgModal.title }}</h3>

        <p class="modal-message" v-html="msgModal.message"></p>

        <hr class="modal-divider" v-if="msgModal.buttonLabel1"/>

        <div class="modal-actions">
          <button
              v-if="msgModal.buttonLabel1"
              @click="msgModal.onclick1()"
              :class="['btn', btnDanger || 'btn-primary']"
          >
            {{ msgModal.buttonLabel1 }}
          </button>

          <button
              v-if="msgModal.buttonLabel2"
              @click="msgModal.onclick2()"
              class="btn btn-secondary"
          >
            {{ msgModal.buttonLabel2 }}
          </button>
        </div>

      </div>

    </div>
  </Transition>
</template>

<script setup>
import { msgModal } from '@/utils/modals/msg-modal.js';
import {computed} from "vue";

const btnDanger = computed(() => msgModal.danger?'btn-danger':'btn-primary')

</script>


<style scoped>
@import '../assets/modal.css';
@import '../assets/views.css';
</style>
