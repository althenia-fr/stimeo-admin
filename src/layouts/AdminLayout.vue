<template>
  <div class="admin-wrapper">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <img src="/stimeo_logo.png" alt="stimeo logo" width="100" style="display:block; margin: auto">
      </div>

      <nav class="sidebar-menu">
        <router-link to="/auth/catalog" class="menu-item" active-class="active">
          <font-awesome-icon icon="fa-solid fa-cart-plus"/>
          <span class="label">Catalogue</span>
        </router-link>

        <div>

          <div
              class="menu-item group-title"
              @click="toggleOrganisation"
              :class="{ 'open': isOrganisationOpen }"
          >
            <font-awesome-icon :icon="isOrganisationOpen ? 'fa-regular fa-square-minus' : 'fa-regular fa-square-plus'"/>
            <span class="label">Organisations</span>
          </div>

          <div class="sub-menu" v-show="isOrganisationOpen">

            <router-link to="/auth/delegates" class="menu-item" active-class="active">
              <img src="/favicon.ico" width="17px"/>
              <span class="label">Délégués</span>
            </router-link>

            <router-link to="/auth/sites" class="menu-item" active-class="active">
              <font-awesome-icon icon="fa-solid fa-house-medical"/>
              <span class="label">Etablissements</span>
            </router-link>

            <router-link to="/auth/teams" class="menu-item" active-class="active">
              <font-awesome-icon icon="fa-solid fa-users"/>
              <span class="label">Services</span>
            </router-link>

          </div>

        </div>

        <router-link to="/auth/pecs" class="menu-item" active-class="active">
          <font-awesome-icon icon="fa-solid fa-hand-holding-medical"/>
          <span class="label">Prises en charge</span>
        </router-link>

        <router-link to="/auth/patients" class="menu-item" active-class="active">
          <font-awesome-icon icon="fa-solid fa-bed"/>
          <span class="label">Patients</span>
        </router-link>

        <div>

          <div
              class="menu-item group-title"
              @click="toggleIdels"
              :class="{ 'open': isIdelOpen }"
          >
            <font-awesome-icon :icon="isIdelOpen ? 'fa-regular fa-square-minus' : 'fa-solid fa-user-nurse'"/>
            <span class="label">Idels</span>
          </div>

          <div class="sub-menu" v-show="isIdelOpen">

            <router-link to="/auth/idels/list" class="menu-item" active-class="active">
              <font-awesome-icon icon="fa-solid fa-user-nurse"/>
              <span class="label">Idels</span>
            </router-link>

            <router-link to="/auth/idels/visits" class="menu-item" active-class="active">
              <font-awesome-icon icon="fa-solid fa-house-medical-circle-check"/>
              <span class="label">Visites</span>
            </router-link>


          </div>

        </div>


        <div>

          <div
              class="menu-item group-title"
              @click="toggleCRP"
              :class="{ 'open': isCRPOpen }"
          >
            <font-awesome-icon :icon="isCRPOpen ? 'fa-regular fa-square-minus' : 'fa-solid fa-phone'"/>
            <span class="label">CRP</span>
          </div>

          <div class="sub-menu" v-show="isCRPOpen">

            <router-link to="/auth/crp/followup" class="menu-item" active-class="active">
              <font-awesome-icon icon="fa-solid fa-phone"/>
              <span class="label">Suivi</span>
            </router-link>

            <router-link to="/auth/crp/missing" class="menu-item" active-class="active">
              <font-awesome-icon icon="fa-solid fa-triangle-exclamation"/>
              <span class="label">Doc manquants</span>
            </router-link>


          </div>

        </div>


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
import MsgModal from "@/components/modals/MsgModal.vue";
import {storageService} from "@/utils/storage.js";
import {ref} from "vue";

const isOrganisationOpen = ref(false);
const toggleOrganisation = () => {
  isOrganisationOpen.value = !isOrganisationOpen.value;
};

const isIdelOpen = ref(false);
const toggleIdels = () => {
  isIdelOpen.value = !isIdelOpen.value;
};

const isCRPOpen = ref(false);
const toggleCRP = () => {
  isCRPOpen.value = !isCRPOpen.value;
};

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
  color: var(--stimeo-accent);
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


/* Styles du menu parent */
.menu-group {
  margin-bottom: 0.5rem;
}

.group-title {
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* Le chevron d'ouverture */
.chevron {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
  color: #94a3b8;
}

/* On tourne le chevron quand le menu est ouvert */
.group-title.open .chevron {
  transform: rotate(180deg);
}

/* Styles des sous-menus */
.sub-menu {
  display: flex;
  flex-direction: column;
  margin-left: 1.2rem; /* Indentation */
  margin-top: 0.25rem;
  padding-left: 0.5rem;
}

.sub-menu-item {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  color: #475569;
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  margin-bottom: 0.15rem;
}

.sub-menu-item:hover {
  background: #f1f5f9;
  color: var(--stimeo-primary, #2c3e50);
}

.sub-menu-item.active {
  color: var(--stimeo-primary, #2c3e50);
  font-weight: 600;
  background: #e0f2fe; /* Couleur de fond d'un sous-menu actif */
}

.icon-sm {
  font-size: 0.85rem;
  margin-right: 0.5rem;
  opacity: 0.7;
}



</style>

