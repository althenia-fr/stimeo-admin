<script setup>
import {wizardPecForm} from "@/utils/pec-wizard.js";

// Réception du step actuel géré par l'assistant parent
const props = defineProps({
  substep: Number
});


function toggleObjective(o) {
  const i = wizardPecForm.protocolTensUro.uro.objectifs.indexOf(o)
  if (i === -1) wizardPecForm.protocolTensUro.uro.objectifs.push(o)
  else wizardPecForm.protocolTensUro.uro.objectifs.splice(i, 1)
}

function  razApneeStates(){

  wizardPecForm.protocolTensUro.apneeAppareille = null;
  wizardPecForm.protocolTensUro.apneeAccompagnementSouhaite = null;
  wizardPecForm.protocolTensUro.apneeExamenDate = null;
  wizardPecForm.protocolTensUro.apneeExamenEnvisage = null;

}

const clampValue = (obj, key, min = 0, max = 1440) => {
  if (obj[key] === null || obj[key] === undefined || obj[key] === '') return
  if (obj[key] < min) obj[key] = min
  if (obj[key] > max) obj[key] = max
}

const protocolObjectives = ['Mictions','Urgenturies','Mictions nocturnes','Urgenturies nocturnes','Fuites','Protections','Douleur']

</script>

<template>
  <div class="protocol-mini-wizard">

    <!-- substep Caractérisation du Trouble -->
    <div v-show="substep === 1" class="centered-compact-card mini-step-fade">
      <h3 class="card-title text-primary-color">Caractérisation du Trouble</h3>

      <div class="form-group-inline mt-3">
        <label>Origine du trouble</label>
        <select v-model="wizardPecForm.protocolTensUro.origineNeurologique" class="form-control">
          <option :value=null disabled>Veuillez choisir...</option>
          <option :value=true>Neurologique</option>
          <option :value=false>Non neurologique</option>
        </select>
      </div>


      <div class="form-group-inline mt-3">
        <label>Indication thérapeutique</label>
        <select v-model="wizardPecForm.protocolTensUro.uro.indication" class="form-control">
          <option :value=null disabled>Veuillez choisir...</option>
          <option value="Hyperactivité">Hyperactivité</option>
          <option value="Urinaire">Incontinence urinaire</option>
          <option value="Fécale">Incontinence fécale</option>
          <option value="Endométriose">Endométriose</option>
        </select>
      </div>

    </div>

    <!-- substep Objectifs thérapeutiques (Compact, Centré, Horizontal & Conditionnel) -->
    <div v-show="substep === 2" class="centered-compact-card mini-step-fade">
      <h3 class="card-title text-primary-color">Objectifs thérapeutiques</h3>

      <!-- Sélection des objectifs (Horizontal comme l'IDEL) -->
      <div class="form-group-inline alignment-top mb-4">
        <label>Objectifs visés</label>
        <div class="objectives-checkbox-row-flex">
          <label v-for="o in protocolObjectives" :key="'obj-' + o" class="checkbox-inline-label">
            <input
                type="checkbox"
                :checked="wizardPecForm.protocolTensUro.uro.objectifs.includes(o)"
                @change="toggleObjective(o)"
                class="native-form-checkbox"
            />
            <span class="checkbox-text-label">{{ o }}</span>
          </label>
        </div>
      </div>

      <!-- Affichage conditionnel des compteurs reliés aux cases à cocher -->
      <div class="form-group-inline mini-step-fade" v-if="wizardPecForm.protocolTensUro.uro.objectifs.includes('Mictions')">
        <label>Mictions / jour (actuel)</label>
        <input type="number" v-model.number="wizardPecForm.protocolTensUro.uro.mictions" min="0" max="50" @input="clampValue(wizardPecForm.protocolTensUro.uro, 'mictions')" class="form-control" />
      </div>

      <div class="form-group-inline mini-step-fade" v-if="wizardPecForm.protocolTensUro.uro.objectifs.includes('Urgenturies')">
        <label>Urgenturies / jour (actuel)</label>
        <input type="number" v-model.number="wizardPecForm.protocolTensUro.uro.urgenturies" min="0" max="50" @input="clampValue(wizardPecForm.protocolTensUro.uro, 'urgenturies')" class="form-control" />
      </div>

      <div class="form-group-inline mini-step-fade" v-if="wizardPecForm.protocolTensUro.uro.objectifs.includes('Mictions nocturnes')">
        <label>Mictions / nuit (actuel)</label>
        <input type="number" v-model.number="wizardPecForm.protocolTensUro.uro.mic_nocturnes" min="0" max="50" @input="clampValue(wizardPecForm.protocolTensUro.uro, 'mic_nocturnes')" class="form-control" />
      </div>

      <div class="form-group-inline mini-step-fade" v-if="wizardPecForm.protocolTensUro.uro.objectifs.includes('Urgenturies nocturnes')">
        <label>Urgenturies / nuit (actuel)</label>
        <input type="number" v-model.number="wizardPecForm.protocolTensUro.uro.urg_nocturnes" min="0" max="50" @input="clampValue(wizardPecForm.protocolTensUro.uro, 'urg_nocturnes')" class="form-control" />
      </div>

      <div class="form-group-inline mini-step-fade" v-if="wizardPecForm.protocolTensUro.uro.objectifs.includes('Fuites')">
        <label>Fuites / jour (actuel)</label>
        <input type="number" v-model.number="wizardPecForm.protocolTensUro.uro.fuites" min="0" max="50" @input="clampValue(wizardPecForm.protocolTensUro.uro, 'fuites')" class="form-control" />
      </div>

      <div class="form-group-inline mini-step-fade" v-if="wizardPecForm.protocolTensUro.uro.objectifs.includes('Protections')">
        <label>Protections / jour (actuel)</label>
        <input type="number" v-model.number="wizardPecForm.protocolTensUro.uro.protections" min="0" max="50" @input="clampValue(wizardPecForm.protocolTensUro.uro, 'protections')" class="form-control" />
      </div>

      <div class="form-group-inline mt-3" v-if="wizardPecForm.protocolTensUro.uro.objectifs.includes('Douleur')">
        <label>Douleur (actuelle)</label>
        <select v-model="wizardPecForm.protocolTensUro.uro.douleur" class="form-control">
          <option :value="0">Pas de douleur</option>
          <option :value="1">Faible</option>
          <option :value="2">Modérée</option>
          <option :value="3">Intense</option>
          <option :value="4">Insupportable</option>
        </select>
      </div>

    </div>

    <!-- substep Séances -->
    <div v-show="substep === 3" class="centered-compact-card mini-step-fade">
      <h3 class="card-title text-primary-color">Séances</h3>

      <div class="form-group-inline alignment-top">

          <label>Durée séance (min)</label>
          <input type="number" v-model.number="wizardPecForm.protocolTensUro.dureeSeance" min="0" max="300" class="form-control" />

      </div>


      <div class="form-group-inline mt-3">

          <label>Nombre séances / jour</label>
          <input type="number" v-model.number="wizardPecForm.protocolTensUro.seancesQuotidiennes" min="0" max="10" class="form-control" />

      </div>

    </div>

    <!-- substep Évaluation -->
    <div v-show="substep === 4" class="centered-compact-card mini-step-fade">
      <h3 class="card-title text-primary-color">Évaluation</h3>

      <div class="form-group-inline alignment-top">

        <label>Fréquence d'évaluation</label>
        <select v-model="wizardPecForm.protocolTensUro.assessmentFrequency" class="form-control">
          <option :value=null disabled>Veuillez choisir...</option>
          <option value="WEEKLY">Hebdomadaire</option>
          <option value="BIMONTHLY">Tous les 15 jours</option>
          <option value="MONTHLY">Mensuelle</option>
        </select>

      </div>

      <div class="form-group-inline mt-3">
        <label>Démarrage à partir de :</label>
        <select v-model="wizardPecForm.protocolTensUro.assessmentStartWeeks" class="form-control">
          <option :value=null disabled>Veuillez choisir...</option>
          <option :value="4">4 semaines de traitement</option>
          <option :value="6">6 semaines de traitement</option>
          <option :value="8">8 semaines de traitement</option>
        </select>
      </div>
    </div>

    <!-- substep Suivi Longitudinal -->
    <div v-show="substep === 5" class="centered-compact-card mini-step-fade">
      <h3 class="card-title text-primary-color">Suivi Longitudinal</h3>


      <div class="form-group-inline mt-3">
        <label>Urinary Symptom Profile (USP)</label>
        <select v-model="wizardPecForm.protocolTensUro.uspEnabled" class="form-control">
          <option :value=null disabled>Veuillez choisir...</option>
          <option :value=true>Oui</option>
          <option :value=false>Non</option>
        </select>
      </div>

      <div class="form-group-inline mt-3">
        <label>Calendrier mictionnel</label>
        <select v-model="wizardPecForm.protocolTensUro.calendrierMictionnelEnabled" class="form-control">
          <option :value=null disabled>Veuillez choisir...</option>
          <option :value=true>Oui</option>
          <option :value=false>Non</option>
        </select>
      </div>

    </div>

    <!-- substep Apnée du sommeil -->
    <div v-show="substep === 6" class="centered-compact-card mini-step-fade">
      <h3 class="card-title text-primary-color">Apnée du sommeil</h3>

      <div class="form-group-inline mt-3">
        <label>Apnée du sommeil</label>
        <select v-model="wizardPecForm.protocolTensUro.apneeSommeil" @change="razApneeStates" class="form-control">
          <option :value=null disabled>Veuillez choisir...</option>
          <option value="NSP">Ne sait pas</option>
          <option value="Oui">Oui</option>
          <option value="Non">Non</option>
        </select>
      </div>

      <div class="form-group-inline mt-3" v-if="wizardPecForm.protocolTensUro.apneeSommeil === 'Oui'">

        <label>Le patient est-il appareillé ?</label>
        <select v-model="wizardPecForm.protocolTensUro.apneeAppareille" class="form-control">
          <option :value=null disabled>Veuillez choisir...</option>
          <option :value=true>Oui</option>
          <option :value=false>Non</option>
        </select>

      </div>

      <div v-if="wizardPecForm.protocolTensUro.apneeSommeil === 'Non' || wizardPecForm.protocolTensUro.apneeSommeil === 'NSP' || wizardPecForm.protocolTensUro.apneeAppareille===false">

        <div class="form-group-inline mt-3">
          <label>Un examen est-il envisagé ?</label>
          <select v-model="wizardPecForm.protocolTensUro.apneeExamenEnvisage" class="form-control">
            <option :value=null disabled>Veuillez choisir...</option>
            <option :value=true>Oui</option>
            <option :value=false>Non</option>
          </select>
        </div>


        <div v-if="wizardPecForm.protocolTensUro.apneeExamenEnvisage===true" class="form-group-inline mt-2">
          <label>À partir de quand ?</label>
          <input v-model="wizardPecForm.protocolTensUro.apneeExamenDate" type="text" class="form-control" placeholder="Période ou date prévue" />
        </div>

        <div v-else-if="wizardPecForm.protocolTensUro.apneeExamenEnvisage===false" class="form-group-inline mt-3">
            <label>Le patient souhaite un accompagnement?</label>
            <select v-model="wizardPecForm.protocolTensUro.apneeAccompagnementSouhaite" class="form-control">
              <option :value=null disabled>Veuillez choisir...</option>
              <option :value=true>Oui</option>
              <option :value=false>Non</option>
            </select>
        </div>

      </div>
    </div>

    <!-- substep Note -->
    <div v-show="substep === 7" class="centered-compact-card mini-step-fade">
      <h3 class="card-title text-primary-color">Note</h3>
      <div class="form-group mt-2">
        <label class="mb-2 block-label">Commentaire pour le CRP Stiméo</label>
        <textarea v-model="wizardPecForm.protocolTensUro.commentaireProtocole" rows="4" class="form-control heavy-textarea" placeholder="Indications cliniques libres..."></textarea>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import '@/assets/forms.css';
@import '@/assets/views.css';
@import '@/assets/card.css';

.text-primary-color { color: var(--stimeo-primary); }
.block-label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--stimeo-text); }
.alignment-top label { vertical-align: top; padding-top: 4px; }

.centered-compact-card {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

/* Alignement des cases à cocher à la suite les unes des autres (Comme pour l'IDEL) */
.objectives-checkbox-row-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  width: 100%;
}

.checkbox-inline-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-text-label {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

/* Style customisé pour forcer la coche blanche sur fond couleur projet */
.native-form-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  background-color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

/* État coché : Fond de la couleur principale du projet */
.native-form-checkbox:checked {
  background-color: var(--stimeo-primary, #cabf75);
  border-color: var(--stimeo-primary, #cabf75);
}

/* Dessin de la coche blanche parfaite */
.native-form-checkbox:checked::after {
  content: "";
  width: 5px;
  height: 11px;
  border: solid #ffffff; /* Coche blanche unie */
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  position: absolute;
  top: 0px; /* Ajustement précis du centrage de la coche */
}

.custom-switch-btn.switch-active .switch-bullet { transform: translateX(16px); }

.heavy-textarea { resize: vertical; width: 100%; }

.mini-step-fade { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>