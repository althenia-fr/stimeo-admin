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
              :class="['btn-base', dangerColor || 'btn-primary']"
          >
            {{ msgModal.buttonLabel1 }}
          </button>

          <button
              v-if="msgModal.buttonLabel2"
              @click="msgModal.onclick2()"
              class="btn-base btn-secondary"
          >
            {{ msgModal.buttonLabel2 }}
          </button>
        </div>

      </div>

    </div>
  </Transition>
</template>

<script setup>
import { msgModal } from '@/utils/msg-modal.js';
import {computed} from "vue";

const dangerColor = computed(() => msgModal.danger?'bg-red-600 hover:bg-red-800':'bg-gold hover:bg-darkgold')

</script>


<style scoped>
/* Arrière-plan semi-transparent avec flou d'ambiance */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(10, 37, 64, 0.4); /* Teinte basée sur --stimeo-primary */
  backdrop-filter: blur(4px); /* Effet de flou moderne */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Boîte blanche du contenu */
.modal-content {
  background: var(--stimeo-bg);
  width: 100%;
  max-width: 440px;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--stimeo-border);
  box-shadow: 0 20px 25px -5px rgba(10, 37, 64, 0.1),
  0 8px 10px -6px rgba(10, 37, 64, 0.1);
}

/* Titre */
h3 {
  color: var(--stimeo-primary);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: -0.3px;
}

/* Message */
.modal-message {
  color: var(--stimeo-text-light);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

/* Séparateur discret */
.modal-divider {
  border: none;
  border-top: 1px solid var(--stimeo-border);
  margin: 1rem 0;
}

/* Agencement des boutons (alignés à droite, secondaire à gauche du principal) */
.modal-actions {
  display: flex;
  flex-direction: row-reverse; /* Aligne à droite et inverse l'ordre visuel */
  gap: 10px;
  justify-content: flex-start;
}

/* Base commune des boutons */
.btn-base {
  padding: 0.55rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
}

/* Bouton bleu Stimeo par défaut */
.btn-primary {
  background: var(--stimeo-primary);
  color: white;
}
.btn-primary:hover {
  opacity: 0.9;
}

/* Bouton secondaire / Annuler */
.btn-secondary {
  background: transparent;
  color: var(--stimeo-text-light);
  border: 1px solid var(--stimeo-border);
}
.btn-secondary:hover {
  background: var(--stimeo-bg);
  color: var(--stimeo-text);
  border-color: var(--stimeo-text-light);
}

/* Classe Danger (si votre variable dangerColor renvoie 'btn-danger') */
.btn-danger {
  background: #ff4d4d;
  color: white;
}
.btn-danger:hover {
  background: #e60000;
}

/* --- ANIMATIONS DE TRANSITION (Vue.js) --- */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Effet de léger zoom/pop sur la boîte de dialogue en même temps que le fondu */
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
