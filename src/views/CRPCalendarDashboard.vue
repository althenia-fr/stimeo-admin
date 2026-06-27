<template>
  <div class="page-container">

    <div class="page-header">
      <div class="header-titles">
        <h2 class="title">Calendrier des Appels Patient</h2>
        <p class="subtitle">Planification et suivi de l'équipe Centre Relation Patient (CRP)</p>
      </div>
    </div>

    <div class="info-card mb-4">

      <div class="calendar-navigation-header">
        <div class="month-scroller-actions">
          <button type="button" class="month-arrow-btn" @click="handlePrev">◄</button>
          <div class="select-month-container-fixed">
            <h3 class="card-title select-month-title-btn">
              {{ displayNavigationTitle }}
            </h3>
          </div>
          <button type="button" class="month-arrow-btn" @click="handleNext">►</button>
        </div>

        <div class="toggle-view-format-pills">
          <button type="button" class="pill-format-btn" :class="{ 'active': viewMode === 'weekly' }" @click="viewMode = 'weekly'">Semaine</button>
          <button type="button" class="pill-format-btn" :class="{ 'active': viewMode === 'monthly' }" @click="viewMode = 'monthly'">Mois</button>
        </div>
      </div>

      <div v-if="viewMode === 'weekly'" class="crp-calendar-grid-7d mini-fade">
        <div
            v-for="d in weeklyDaysToDisplay"
            :key="'7d-' + d.day"
            @click="toggleDaySelection(d.day)"
            class="calendar-day-box"
            :class="{ 'day-selected': selectedDay === d.day, 'day-has-calls': d.total > 0 }"
        >
          <span class="day-number">{{ monthsList[currentMonthIdx] }} {{ d.day }}</span>
          <div v-if="d.total > 0" class="day-progress-badges">
            <span class="badge-done">{{ d.done }} faits</span>
            <span class="badge-total">/ {{ d.total }} au total</span>
          </div>
          <div v-else class="day-empty-label">Aucun appel</div>
        </div>
      </div>

      <div v-else class="crp-calendar-matrix-30d mini-fade">
        <div v-for="week in weeksDatabase" :key="'w-' + week.weekNumber" class="monthly-week-row-layout">

          <div class="monthly-days-subgrid">
            <div
                v-for="d in week.days"
                :key="'30d-' + d.day"
                @click="toggleDaySelection(d.day)"
                class="calendar-day-box mini-box"
                :class="{
                'day-selected': selectedDay === d.day && d.day,
                'day-has-calls': d.total > 0 && d.day,
                'empty-calendar-cell': !d.day
              }"
            >
              <template v-if="d.day">
                <span class="day-number-mini">
                  {{ d.day }} <span class="month-abbreviation-inline">{{ shortMonthsList[currentMonthIdx] }}</span>
                </span>
                <span v-if="d.total > 0" class="day-stats-fraction-mini" :class="{ 'all-done': d.done === d.total }">
                  {{ d.done }}/{{ d.total }}
                </span>
              </template>
            </div>
          </div>

        </div>
      </div>

    </div>

    <div class="table-container stable-scroll-lock">

      <div class="table-header-bar-flex">
        <h3 class="table-section-title">{{ dynamicListTitle }}</h3>

        <div class="search-wrapper compact-table-search">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon"/>
          <input type="text" v-model="searchQuery" placeholder="Rechercher partout dans ce tableau..." class="search-input" />
        </div>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th style="width: 15%">Date / Heure</th>
          <th>Patient</th>
          <th>Téléphone</th>
          <th>Agent CRP Responsable</th>
          <th>Motif / Mention courte</th>
          <th style="width: 15%; text-align: center;">État</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="filteredCalls.length === 0">
          <td colspan="6" class="empty-state">Aucun appel ne correspond aux critères de recherche actuels ou pour cette période.</td>
        </tr>
        <tr v-for="call in filteredCalls" :key="call.id" @click="goToCallSheet(call.id)" class="clickable-row">
          <td class="font-semibold text-primary-color-dim">{{ call.dateDisplay }}</td>
          <td class="font-semibold">{{ call.patient }}</td>
          <td>{{ call.phone }}</td>
          <td>
            <span class="agent-avatar-tag">{{ call.agent }}</span>
          </td>
          <td class="text-truncate">{{ call.mention }}</td>
          <td class="text-center">
              <span class="status-pill-badge" :class="'pill-' + call.status.replace(' ', '-')">
                {{ call.status }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {msgModal} from "@/utils/modals/msg-modal.js";

const emit = defineEmits(['open-call-sheet'])

// --- CONFIGURATION DES ÉTATS ---
const viewMode = ref('weekly') // 'weekly' (Semaine) ou 'monthly' (Mois)
const selectedDay = ref(15) // Jour sélectionné par défaut
const activeWeekIndex = ref(2) // Index par défaut (Semaine 25)
const searchQuery = ref('')

const monthsList = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const shortMonthsList = ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.']
const currentMonthIdx = ref(5) // Juin par défaut
const currentYear = ref(2026)

// --- TITRE DE NAVIGATION ET LOGIQUE DES FLÈCHES INTERACTIVES ---
const displayNavigationTitle = computed(() => {
  if (viewMode.value === 'weekly') {
    return `Semaine ${weeksDatabase.value[activeWeekIndex.value].weekNumber}`
  }
  return `${monthsList[currentMonthIdx.value]} ${currentYear.value}`
})

function handlePrev() {
  if (viewMode.value === 'weekly') {
    // Mode Semaine : Les flèches font défiler les semaines de la base
    if (activeWeekIndex.value > 0) {
      activeWeekIndex.value--
    } else {
      activeWeekIndex.value = weeksDatabase.value.length - 1 // Boucle de confort pour la maquette
    }
  } else {
    // Mode Mois : Les flèches font défiler les mois
    if (currentMonthIdx.value === 0) {
      currentMonthIdx.value = 11
      currentYear.value--
    } else {
      currentMonthIdx.value--
    }
  }
}

function handleNext() {
  if (viewMode.value === 'weekly') {
    if (activeWeekIndex.value < weeksDatabase.value.length - 1) {
      activeWeekIndex.value++
    } else {
      activeWeekIndex.value = 0
    }
  } else {
    if (currentMonthIdx.value === 11) {
      currentMonthIdx.value = 0
      currentYear.value++
    } else {
      currentMonthIdx.value++
    }
  }
}

// --- LOGIQUE DE SÉLECTION / DÉCLIC DU JOUR ---
function toggleDaySelection(dayNum) {
  if (!dayNum) return
  if (selectedDay.value === dayNum) {
    selectedDay.value = null // Déclic : On vide la sélection pour ouvrir le périmètre
  } else {
    selectedDay.value = dayNum
  }
}

// --- TITRE DYNAMIQUE DE LA LISTE SELON LE PÉRIMÈTRE ---
const dynamicListTitle = computed(() => {
  const currentMonthName = monthsList[currentMonthIdx.value]

  if (selectedDay.value) {
    return `Liste des appels du ${selectedDay.value} ${currentMonthName}`
  }

  if (viewMode.value === 'weekly') {
    const validDays = weeksDatabase.value[activeWeekIndex.value].days.filter(d => d.day)
    const startDay = validDays[0].day
    const endDay = validDays[validDays.length - 1].day
    return `Liste des appels de la Semaine ${weeksDatabase.value[activeWeekIndex.value].weekNumber} (du ${startDay} au ${endDay} ${currentMonthName})`
  }

  return `Liste des appels du mois de ${monthsList[currentMonthIdx.value]} ${currentYear.value}`
})

// --- FAUSSES DONNÉES LOCALES ---
const weeksDatabase = ref([
  {
    weekNumber: 23,
    days: [
      { day: 1, total: 1, done: 1 }, { day: 2, total: 0, done: 0 }, { day: 3, total: 1, done: 1 },
      { day: 4, total: 0, done: 0 }, { day: 5, total: 1, done: 0 }, { day: 6, total: 0, done: 0 }, { day: 7, total: 0, done: 0 }
    ]
  },
  {
    weekNumber: 24,
    days: [
      { day: 8, total: 1, done: 1 }, { day: 9, total: 0, done: 0 }, { day: 10, total: 0, done: 0 },
      { day: 11, total: 1, done: 0 }, { day: 12, total: 0, done: 0 }, { day: 13, total: 0, done: 0 }, { day: 14, total: 0, done: 0 }
    ]
  },
  {
    weekNumber: 25,
    days: [
      { day: 15, total: 6, done: 3 }, { day: 16, total: 0, done: 0 }, { day: 17, total: 0, done: 0 },
      { day: 18, total: 0, done: 0 }, { day: 19, total: 0, done: 0 }, { day: 20, total: 0, done: 0 }, { day: 21, total: 0, done: 0 }
    ]
  },
  {
    weekNumber: 26,
    days: [
      { day: 22, total: 0, done: 0 }, { day: 23, total: 1, done: 1 }, { day: 24, total: 0, done: 0 },
      { day: 25, total: 0, done: 0 }, { day: 26, total: 0, done: 0 }, { day: 27, total: 0, done: 0 }, { day: 28, total: 0, done: 0 }
    ]
  },
  {
    weekNumber: 27,
    days: [
      { day: 29, total: 1, done: 1 }, { day: 30, total: 0, done: 0 },
      { day: null, total: 0, done: 0 }, { day: null, total: 0, done: 0 }, { day: null, total: 0, done: 0 },
      { day: null, total: 0, done: 0 }, { day: null, total: 0, done: 0 }
    ]
  }
])

const weeklyDaysToDisplay = computed(() => {
  return weeksDatabase.value[activeWeekIndex.value].days
})

const fakeCallsDatabase = ref([
  { id: 101, day: 15, dateDisplay: "15/06 12:30", patient: "MARTIN Lucas", phone: "06 12 34 56 78", agent: "Julie R.", mention: "Suivi TENS J+7", status: "effectué" },
  { id: 102, day: 15, dateDisplay: "15/06 14:15", patient: "BERNARD Chloé", phone: "07 98 76 54 32", agent: "Julie R.", mention: "Rappel tolérance appareil", status: "pas effectué" },
  { id: 103, day: 15, dateDisplay: "15/06 16:00", patient: "THOMAS Julien", phone: "06 45 67 89 12", agent: "Pierre M.", mention: "Bilan mensuel uro", status: "reporté" },
  { id: 104, day: 15, dateDisplay: "15/06 17:30", patient: "PETIT Emma", phone: "06 78 91 23 45", agent: "Julie R.", mention: "Vérification mictions nuit", status: "effectué" },
  { id: 105, day: 15, dateDisplay: "15/06 18:00", patient: "ROBERT Jean-Pierre", phone: "07 32 16 54 98", agent: "Pierre M.", mention: "Premier appel d'onboarding", status: "effectué" },
  { id: 106, day: 15, dateDisplay: "15/06 19:15", patient: "RICHARD Sophie", phone: "06 65 49 87 32", agent: "Julie R.", mention: "Suivi tolérance électrodes", status: "pas effectué" },

  { id: 201, day: 3,  dateDisplay: "03/06 09:30", patient: "ALVES Maria", phone: "06 01 02 03 04", agent: "Pierre M.", mention: "Contrôle fuites", status: "effectué" },
  { id: 202, day: 5,  dateDisplay: "05/06 11:00", patient: "GARCIA Diego", phone: "06 55 44 33 22", agent: "Julie R.", mention: "Vérification protections", status: "pas effectué" },
  { id: 203, day: 8,  dateDisplay: "08/06 10:15", patient: "DUBOIS René", phone: "07 11 22 33 44", agent: "Pierre M.", mention: "Analyse urgenturies", status: "effectué" },
  { id: 204, day: 11, dateDisplay: "11/06 15:45", patient: "FOURNIER Paul", phone: "06 99 88 77 66", agent: "Julie R.", mention: "Suivi nicturie", status: "pas effectué" },
  { id: 205, day: 23, dateDisplay: "23/06 14:00", patient: "MOREAU Nicole", phone: "07 44 55 66 77", agent: "Pierre M.", mention: "Onboarding TENS", status: "effectué" },
  { id: 206, day: 29, dateDisplay: "29/06 16:30", patient: "LEFEVRE Michel", phone: "06 22 44 66 88", agent: "Julie R.", mention: "Bilan fin de mois", status: "effectué" }
])

// --- COMPOSITE DE FILTRAGE ASSOCIEE AUX NOUVELLES RÈGLES DE SCOPE ---
const filteredCalls = computed(() => {
  let scopeCalls = fakeCallsDatabase.value

  if (selectedDay.value) {
    // 1. Un jour est sélectionné -> Filtrage exclusif sur ce jour unique
    scopeCalls = scopeCalls.filter(c => c.day === selectedDay.value)
  } else if (viewMode.value === 'weekly') {
    // 2. Déclic en mode Semaine -> Affiche l'intégralité des appels de la semaine active
    const targetWeekDays = weeksDatabase.value[activeWeekIndex.value].days.map(d => d.day).filter(Boolean)
    scopeCalls = scopeCalls.filter(c => targetWeekDays.includes(c.day))
  } // 3. Déclic en mode Mois -> Affiche tous les appels du mois (conserve la base complète)

  // Filtre textuel multi-colonnes global
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return scopeCalls

  return scopeCalls.filter(item => {
    return (
        item.patient.toLowerCase().includes(query) ||
        item.phone.includes(query) ||
        item.agent.toLowerCase().includes(query) ||
        item.mention.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query) ||
        item.dateDisplay.toLowerCase().includes(query)
    )
  })
})

function displayNameMonth() {
  return monthsList[currentMonthIdx.value]
}
function goToCallSheet(callId) {
  emit('open-call-sheet', callId)
}

// Message de mise en garde MOA requis
onMounted(() => {
  msgModal.show(
      'ATTENTION',
      "Les écrans de la section CRP sont en cours de développement et les données sont affichées à titre illustratif.",
      'OK',
      msgModal.defaultClose,
      null,
      null,
      true
  );
});
</script>

<style scoped>
@import '@/assets/views.css';
@import '@/assets/card.css';
@import '@/assets/forms.css';

.mb-4 { margin-bottom: 1.25rem; }
.clickable-row { cursor: pointer; transition: background 0.15s; }
.clickable-row:hover { background-color: #f8fafc; }
.text-primary-color-dim { color: var(--stimeo-accent, #91873e); }

.table-header-bar-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid var(--stimeo-border);
  background: #fff;
  gap: 1rem;
}
.table-section-title { font-size: 0.9rem; font-weight: 700; color: var(--stimeo-primary); text-transform: uppercase; margin: 0; }
.compact-table-search { width: 320px; }

.calendar-navigation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}
.month-scroller-actions { display: flex; align-items: center; gap: 0.25rem; }
.month-arrow-btn {
  background: none; border: none; color: var(--stimeo-primary); font-size: 1rem; cursor: pointer; padding: 0.3rem 0.6rem; border-radius: 4px; transition: background 0.15s;
}
.month-arrow-btn:hover { background-color: #f1f5f9; }

/* Largeur augmentée et figée à 180px pour stabiliser les flèches */
.select-month-container-fixed {
  width: 180px;
  min-width: 180px;
  text-align: center;
  display: flex;
  justify-content: center;
}
.select-month-title-btn {
  margin-bottom: 0 !important; font-size: 0.95rem; font-weight: 700; color: var(--stimeo-primary); padding: 0.25rem 0.5rem; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.3px;
}

.toggle-view-format-pills { display: flex; background: #e2e8f0; padding: 2px; border-radius: 6px; }
.pill-format-btn {
  border: none; background: transparent; padding: 0.3rem 0.75rem; font-size: 0.75rem; font-weight: 700; color: #475569; border-radius: 4px; cursor: pointer; transition: all 0.15s;
}
.pill-format-btn.active { background: #ffffff; color: var(--stimeo-text); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

/* GRILLE FOCUS 7 JOURS */
.crp-calendar-grid-7d { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.75rem; }
.calendar-day-box {
  background: #f8fafc; border: 1px solid var(--stimeo-border); border-radius: 6px; padding: 0.75rem; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 85px; transition: all 0.2s ease;
}
.calendar-day-box:hover { border-color: var(--stimeo-primary); background: #ffffff; }
.day-selected { border-color: var(--stimeo-primary) !important; background: #fffdf5 !important; box-shadow: 0 0 0 2px rgba(183, 170, 64, 0.15); }
.day-number { font-size: 0.8rem; font-weight: 700; color: var(--stimeo-text); }
.day-empty-label { font-size: 0.75rem; color: var(--stimeo-text-light); margin-top: 0.5rem; }
.day-progress-badges { display: flex; flex-direction: column; margin-top: 0.4rem; font-size: 0.75rem; }
.badge-done { font-weight: 700; color: #16a34a; }
.badge-total { color: #64748b; font-weight: 500; }

/* MATRICE MENSUELLE (30 JOURS SANS LABELS SEMAINE) */
.crp-calendar-matrix-30d { display: flex; flex-direction: column; gap: 0.4rem; }
.monthly-week-row-layout { display: flex; align-items: center; width: 100%; }
.monthly-days-subgrid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.4rem; flex-grow: 1; }

.mini-box {
  min-height: 42px !important; padding: 0.35rem 0.5rem !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important;
}
.day-number-mini { font-size: 0.825rem; font-weight: 700; color: #1e293b; }
.month-abbreviation-inline { font-size: 0.725rem; font-weight: 600; color: #94a3b8; margin-left: 2px; }
.day-stats-fraction-mini { font-size: 0.75rem; font-weight: 700; color: #64748b; }
.day-stats-fraction-mini.all-done { color: #16a34a; }
.empty-calendar-cell { background-color: transparent !important; border: none !important; cursor: default !important; }

/* ASSIETTE STABLE ANTI-TRESSAUT DE VIEWPORT */
.stable-scroll-lock {
  min-height: 450px;
}

.agent-avatar-tag { background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; color: #475569; }
.status-pill-badge { display: inline-block; padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; text-align: center; }
.pill-effectué { background-color: #dcfce7; color: #16a34a; }
.pill-pas-effectué { background-color: #dbeafe; color: #2563eb; }
.pill-reporté { background-color: #fef3c7; color: #d97706; }

.mini-fade { animation: fadeIn 0.12s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>