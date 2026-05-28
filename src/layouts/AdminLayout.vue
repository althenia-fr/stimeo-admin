<template>
  <div class="admin-wrapper">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <img src="/stimeo_logo.png" alt="stimeo logo" width="100" style="display:block; margin: auto">
      </div>

      <nav class="sidebar-menu">
        <router-link to="/admin/catalog" class="menu-item" active-class="active">
          <font-awesome-icon icon="fa-solid fa-cart-plus"/>
          <span class="label">Catalogue</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="logout">
          <font-awesome-icon icon="fa-solid fa-sign-out"/>
          <span class="label">Déconnexion</span>
        </button>
      </div>

    </aside>

    <main class="main-content">
      <router-view />
      <MsgModal />
    </main>
  </div>
</template>

<script setup>

import {goTo} from "@/router/router.js";
import MsgModal from "@/components/MsgModal.vue";
import {storageService} from "@/utils/storage.js";

const logout = () => {
  storageService.removeItem('admin');
  goTo('/login');
};

</script>
<style scoped>
.admin-wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.sidebar {
  width: 200px;
  background-color: var(--stimeo-bg);
  color: var(--stimeo-accent);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--stimeo-border);
}
.sidebar-brand {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.brand-name {
  font-weight: 700;
  font-size: 1.3rem;
}
.brand-name .sub {
  color: var(--stimeo-accent);
  font-weight: 300;
  font-size: 0.9rem;
  margin-left: 4px;
}
.sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-bottom: 1px solid var(--stimeo-border);
}
.sidebar-footer {
  padding : 15px 0 15px 0;
}
.menu-item, .logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 1rem; /* Padding strictement identique partout */
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.logout-btn, .menu-item {
  color: var(--stimeo-primary);
  text-decoration: none;
  font-size: 0.9rem;
  border: none;
  background-color: var(--stimeo-bg);
}

.menu-item:hover {
  color: var(--stimeo-accent);
  cursor: pointer !important;
}


.logout-btn:hover {
  color: #ff6b6b;
  cursor: pointer !important;
}
.main-content {
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
  background-color: var(--stimeo-bg);
}
</style>

