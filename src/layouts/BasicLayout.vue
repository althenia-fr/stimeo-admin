<template>
  <div class="auth-container">
    <div class="auth-card">
      <router-view />
    </div>
  </div>
  <MsgModal />
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8fafc;
}
.auth-card {
  background: var(--stimeo-bg);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 420px;
}
.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 2rem;
}
.stimeo-logo {
  width: 32px;
  height: 32px;
}
.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--stimeo-primary);
  letter-spacing: -0.5px;
}
.brand-name .dot { color: var(--stimeo-accent); }
.brand-name .sub { font-weight: 400; font-size: 1.1rem; color: var(--stimeo-text-light); }
</style>
<script setup>
import MsgModal from "@/components/modals/MsgModal.vue";
</script>