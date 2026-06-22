<template>
  <div class="tabs-content">

      <div class="info-card missing-elements-card">

        <!-- En-tête de l'alerte (Header) -->
        <div class="missing-header">
          <div class="header-left">
            <div class="title-container">
              <h3 class="missing-title">Éléments manquants</h3>
            </div>
            <p class="missing-subtitle"><font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="warning-icon" /> Dossier incomplet — éléments requis pour la facturation</p>
          </div>

          <!-- Bloc Deadline à droite -->
          <!--div class="header-right">
            <span class="deadline-label">DEADLINE RÉCUPÉRATION</span>
            <span class="deadline-date">18/03/2026</span>
          </div-->
        </div>

        <!-- Zone centrale : Boutons d'actions rapides -->
        <div class="missing-body">

          <table class="missing-table">
            <thead>
            <tr>
              <th>Élément requis</th>
              <th>Commentaires</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in missingElements"
                :key="item.id"
            >
              <td class="cell-element">
                <div class="element-content">
                  <span class="element-name">{{ item.name }}</span>
                </div>
              </td>
              <td class="cell-explanation">
                {{ item.explanation }}
              </td>
            </tr>
            </tbody>
          </table>

        </div>


      </div>


  </div>
</template>

<style scoped>

@import '@/assets/views.css';
@import '@/assets/forms.css';
@import '@/assets/card.css';

/* Surcharge et customisation de la structure .info-card pour l'alerte */
.missing-elements-card {
  background-color: #fff4f4; /* Fond rose très doux visible sur l'image */
  border: 1px solid #fecdd3;  /* Bordure délicate assortie */
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  height: auto;
}

/* Alignement de l'en-tête */
.missing-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-icon {
  color: #991b1b;
  font-size: 0.95rem;
}

.missing-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #991b1b;
  margin-bottom: 0;          /* Aligne parfaitement avec l'icône */
  text-transform: none;      /* Conserve la casse naturelle */
  letter-spacing: normal;
}

.missing-subtitle {
  font-size: 0.8rem;
  color: #b45309;            /* Teinte marron/rougeâtre adoucie */
  margin: 0.15rem 0 0 0;
}

/* --- TABLEAU --- */
.missing-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff; /* Fond blanc pour faire ressortir le tableau */
  border: 1px solid #fecdd3;
  border-radius: 6px;
  overflow: hidden; /* Applique le radius aux angles extérieurs */
  margin-bottom: 0.25rem;
}

/* En-tête du tableau */
.missing-table th {
  background-color: #ffe4e6; /* Rose un peu plus soutenu pour le header */
  color: #991b1b;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.5rem 0.75rem;
  text-align: left;
  border: 1px solid #fecdd3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Cellules du tableau */
.missing-table td {
  padding: 0.6rem 0.75rem;
  border: 1px solid #fecdd3; /* Cellules entièrement visibles */
  font-size: 0.8rem;
  vertical-align: middle;
}

/* Structure colonne gauche */
.cell-element {
  width: 250px;
  font-weight: 600;
  color: #991b1b;
}

.element-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


/* Colonne droite */
.cell-explanation {
  color: #4b5563;
  line-height: 1.4;
}


</style>
<script setup>

import {computed, ref} from "vue";

const props = defineProps({
  pec: Object,
});

const missingElements = computed(()=>{

  let billableDetails = props.pec.billableDetails
  if(!billableDetails) return []
  else
  {
    let toReturn = []
    let missingElements = billableDetails.split(',')
    for(let i=0;i<missingElements.length;i++)
    {
      let missingElement = {}
      missingElement.id = i
      missingElement.name = missingElements[i]
      missingElement.explanation = workoutExplanations(missingElement.name)
      toReturn.push(missingElement)
    }
    return toReturn
  }

})

function workoutExplanations(name)
{
  if(name.indexOf('IDEL')>-1) return "L'Ordonnance IDEL n'est pas signée. Dans l'onglet Documents vous pouvez la renvoyer au Médecin Prescripteur afin qu'il la signe."
  else if(name.indexOf('ordonnance')>-1)  return "L'Ordonnance n'est pas signée. Dans l'onglet Documents vous pouvez la renvoyer au Médecin Prescripteur afin qu'il la signe."
  else if(name.indexOf('consentement')>-1)  return "Le Consentement n'est pas été signé par le Patient. Dans l'onglet Documents vous pouvez la renvoyer au Patient afin qu'il la signe."
  else if(name.indexOf('docteur')>-1) return "Il y a une erreur sur cette fiche, car le Médecin Prescripteur, normalement obligatoire, est manquant. Contactez le support."
  else if(name.indexOf('établissement')>-1) return "Il y a une erreur sur cette fiche, car l'Etablissement, normalement obligatoire, est manquant. Contactez le support."
  else if(name.indexOf('patient')>-1) return "Il y a une erreur sur cette fiche, car le Patient, normalement obligatoire, est manquant. Contactez le support."
  else if(name.indexOf('AM')>-1) return "Le numéro AM du Médecin Prescripteur est manquant. Mettez à jour la fiche du Médecin (Menu Organisations/Services)"
  else if(name.indexOf('finess')>-1) return "Le numéro finess de l'Etablissement est manquant. Mettez à jour la fiche de l'Etablissement (Menu Organisations/Etablissements)"
  else if(name.indexOf('naissance')>-1) return "La date de naissance du Patient est manquante. Mettez à jour la fiche Patient (Onglet Patient / Info Personnelles)"
  else if(name.indexOf('rang')>-1) return "Le rang du numéro sécu du Patient est manquant. Mettez à jour la fiche Patient (Onglet Patient / Tiers-Payant)"
  else if(name.indexOf('sécu')>-1) return "Le numéro sécu du Patient est manquant. Mettez à jour la fiche Patient (Onglet Patient / Tiers-Payant)"
  else if(name.indexOf('complémentaire')>-1) return "Les infos sur la Mutuelle du Patient sont manquantes. Mettez à jour la fiche Patient (Onglet Patient / Tiers-Payant)"
  else return "??"

}


</script>