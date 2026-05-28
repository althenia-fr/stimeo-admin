<template>
  <div>
    <h2 class="title">Nouveau mot de passe</h2>
    <p class="subtitle">Modifiez les accès de votre compte d'administration</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Ancien mot de passe</label>
        <input type="password" required />
      </div>
      <div class="form-group">
        <label>Nouveau mot de passe</label>
        <input type="password" required />
      </div>
      <div class="form-group">
        <label>Confirmer le mot de passe</label>
        <input type="password" required />
      </div>

      <button type="submit" class="btn-primary">Mettre à jour</button>
    </form>

    <div class="form-footer">
      <router-link to="/login" class="link">Retour à la connexion</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const handleSubmit = () => {
  alert('Mot de passe mis à jour avec succès !');
  router.push('/login');
};
</script>

<style scoped>
@import '../assets/forms.css';
</style>