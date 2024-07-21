<template>
  <div class="calendar-container">
    <h3>My Contributions</h3>
    <div class="year-select-container">
      <label for="year-select">Select Year:</label>
      <select id="year-select" v-model="selectedYear" @change="initCalendar">
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>
    <div class="calendar" @mousemove="updateTooltipPosition">
      <div class="year-row">
        <div class="months">
          <div class="month" v-for="month in months" :key="month.name">
            <div class="month-name">{{ month.name }}</div>
            <div class="weeks">
              <div class="week" v-for="week in month.weeks" :key="week.index">
                <div 
                  class="day" 
                  v-for="day in week.days" 
                  :key="day.date" 
                  :class="[getQuizCountClass(day.quizCount), getDeadlineClass(day)]"
                  @mouseover="showTooltip(day)" 
                  @mouseleave="hideTooltip"
                  @click="editDeadline(day)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="legend">
      <div class="legend-item">
        <div class="color-box light-green"></div>
        <span>0 ≤ Quizzes < 5</span>
      </div>
      <div class="legend-item">
        <div class="color-box middle-green"></div>
        <span>5 ≤ Quizzes < 10</span>
      </div>
      <div class="legend-item">
        <div class="color-box dark-green"></div>
        <span>10+ Quizzes</span>
      </div>
      <div class="add-deadline-button">
        <button @click="toggleAddDeadlineMode">Add Deadline</button>
      </div>
    </div>
    <div v-if="tooltip.visible" class="tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
      <div>{{ tooltip.date }}</div>
      <div v-if="tooltip.quizCount !== null">Quizzes: {{ tooltip.quizCount }}</div>
      <div v-if="tooltip.deadlineTitle">Deadline: {{ tooltip.deadlineTitle }}</div>
      <div v-else>No Deadline</div>
    </div>
    <div v-if="showDeadlineForm" class="deadline-form-overlay">
      <div class="deadline-form">
        <h3>{{ editingDeadline ? 'Edit Deadline' : 'Add Deadline' }}</h3>
        <form @submit.prevent="saveDeadline">
          <label for="deadline-title">Title:</label>
          <input id="deadline-title" v-model="newDeadline.title" required>

          <label for="deadline-date">Date:</label>
          <input type="date" id="deadline-date" v-model="newDeadline.date" required>
          
          <label for="deadline-color">Color:</label>
          <select id="deadline-color" v-model="newDeadline.color" required>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
          </select>

          <button type="submit">OK</button>
          <button type="button" @click="cancelAddDeadline">Cancel</button>
          <button type="button" v-if="editingDeadline" @click="deleteDeadline">Delete</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  userData: {
    type: Array,
    required: true,
  }
});

const years = [2020, 2021, 2022, 2023, 2024];
const selectedYear = ref(new Date().getFullYear());

const months = ref([
  { name: 'January', weeks: [] },
  { name: 'February', weeks: [] },
  { name: 'March', weeks: [] },
  { name: 'April', weeks: [] },
  { name: 'May', weeks: [] },
  { name: 'June', weeks: [] },
  { name: 'July', weeks: [] },
  { name: 'August', weeks: [] },
  { name: 'September', weeks: [] },
  { name: 'October', weeks: [] },
  { name: 'November', weeks: [] },
  { name: 'December', weeks: [] },
]);

const deadlines = ref([]);

const tooltip = ref({
  visible: false,
  date: '',
  quizCount: null,
  deadlineTitle: '',
  x: 0,
  y: 0
});

const showDeadlineForm = ref(false);
const editingDeadline = ref(false);
const newDeadline = ref({
  date: '',
  title: '',
  color: 'red'
});
const currentEditingDeadline = ref(null);

const getWeeksInMonth = (month, year) => {
  const weeks = [];
  let date = new Date(Date.UTC(year, month, 1));
  let week = { index: 0, days: [] };

  while (date.getUTCMonth() === month) {
    if (date.getUTCDay() === 0 && week.days.length) {
      weeks.push(week);
      week = { index: week.index + 1, days: [] };
    }

    week.days.push({ date: new Date(date), quizCount: 0 });
    date.setUTCDate(date.getUTCDate() + 1);
  }

  if (week.days.length) {
    weeks.push(week);
  }

  return weeks;
};

const initCalendar = () => {
  months.value.forEach((month, index) => {
    month.weeks = getWeeksInMonth(index, selectedYear.value);
  });
  updateQuizCounts();
};

const updateQuizCounts = () => {
  months.value.forEach(month => {
    month.weeks.forEach(week => {
      week.days.forEach(day => {
        day.quizCount = 0;
      });
    });
  });

  props.userData.forEach(quiz => {
    const date = new Date(quiz.created_at);
    if (date.getUTCFullYear() === selectedYear.value) {
      const monthIndex = date.getUTCMonth();
      const month = months.value[monthIndex];
      month.weeks.forEach(week => {
        week.days.forEach(day => {
          if (day.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]) {
            day.quizCount += 1;
          }
        });
      });
    }
  });
};

const getQuizCountClass = (quizCount) => {
  if (quizCount === 0) return '';
  if (quizCount < 5) return 'light-green';
  if (quizCount < 10) return 'middle-green';
  return 'dark-green';
};

const getDeadlineClass = (day) => {
  const deadline = deadlines.value.find(d => d.date === day.date.toISOString().split('T')[0]);
  return deadline ? deadline.color : '';
};

const showTooltip = (day) => {
  tooltip.value.visible = true;
  tooltip.value.date = day.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  tooltip.value.quizCount = day.quizCount;
  const deadline = deadlines.value.find(d => d.date === day.date.toISOString().split('T')[0]);
  tooltip.value.deadlineTitle = deadline ? deadline.title : '';
  tooltip.value.x = event.clientX + 10;
  tooltip.value.y = event.clientY + 10;
};

const hideTooltip = () => {
  tooltip.value.visible = false;
};

const toggleAddDeadlineMode = () => {
  newDeadline.value = {
    date: '',
    title: '',
    color: 'red'
  };
  editingDeadline.value = false;
  showDeadlineForm.value = !showDeadlineForm.value;
};

const editDeadline = (day) => {
  const deadline = deadlines.value.find(d => d.date === day.date.toISOString().split('T')[0]);
  if (deadline) {
    newDeadline.value = { ...deadline };
    editingDeadline.value = true;
    showDeadlineForm.value = true;
    currentEditingDeadline.value = deadline;
  }
};

const saveDeadline = () => {
  const formattedDate = new Date(newDeadline.value.date).toISOString().split('T')[0];
  if (editingDeadline.value) {
    const index = deadlines.value.findIndex(d => d.date === currentEditingDeadline.value.date);
    deadlines.value.splice(index, 1, { ...newDeadline.value, date: formattedDate });
  } else {
    deadlines.value.push({ ...newDeadline.value, date: formattedDate });
  }
  showDeadlineForm.value = false;
  newDeadline.value = {
    date: '',
    title: '',
    color: 'red'
  };
  initCalendar();
};

const deleteDeadline = () => {
  const index = deadlines.value.findIndex(d => d.date === currentEditingDeadline.value.date);
  if (index !== -1) {
    deadlines.value.splice(index, 1);
  }
  showDeadlineForm.value = false;
  newDeadline.value = {
    date: '',
    title: '',
    color: 'red'
  };
  initCalendar();
};

const cancelAddDeadline = () => {
  showDeadlineForm.value = false;
  newDeadline.value = {
    date: '',
    title: '',
    color: 'red'
  };
};

const updateTooltipPosition = (event) => {
  if (tooltip.value.visible) {
    tooltip.value.x = event.clientX + 10;
    tooltip.value.y = event.clientY + 10;
  }
};

onMounted(() => {
  initCalendar();
});

watch(selectedYear, initCalendar);
</script>

<style scoped>
h3 {
  font-weight: 800;
  font-size: 1.3em;
  color: #FFFFFF; 
  text-align: center; 
  width: 100%; 
  margin-bottom: 1rem; 
  margin-top: 1rem;
}

label {
  margin-right: 10px;
  color: #00bfff;
  font-weight: bolder;
}

select, button {
  background-color: #1e1e2d;
  color: #ffffff;
  margin-top: 1rem;
  margin-bottom: 3rem;
}

.calendar-container {
  display: flex;
  flex-direction: column; 
  align-items: center; 
  gap: 0.5rem; 
  padding: 1rem; 
  background: rgba(255, 255, 255, 0.09); 
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  backdrop-filter: blur(10px); 
  -webkit-backdrop-filter: blur(10px); 
  max-width: 1600px; 
  width: calc(100% - 2rem); 
  margin-left: 5rem;
  height: 550px;
}

.calendar {
  display: flex;
  flex-direction: column;
  align-items: center; /* Hier werden die Monate und Tage zentriert */
  position: relative;
  margin-left: 2rem;
}

.year-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.months {
  display: flex;
  flex-wrap: wrap;
}

.month {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  margin-bottom: 10px;
}

.month-name {
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
  color: #FFFFFF;
}

.weeks {
  display: flex;
  flex-direction: column;
}

.week {
  display: flex;
}

.day {
  width: 14px;
  height: 14px;
  margin: 1px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.light-green {
  background-color: #87eb9e;
}

.middle-green {
  background-color: #1ccf46;
}

.dark-green {
  background-color: #107928;
}

.red {
  background-color: red !important;
}

.blue {
  background-color: blue !important;
}

.yellow {
  background-color: yellow !important;
}

.green {
  background-color: green !important;
}

.legend {
  display: flex;
  margin-top: 20px;
  color: #FFFFFF;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border: 1px solid #ddd;
}

.add-deadline-button {
  position: absolute;
  bottom: 2px; /* Abstand vom unteren Rand */
  left: 1050px; /* Abstand vom linken Rand */
  top: 450px;
}

.add-deadline-button button {
  background-color: #00bfff;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-deadline-button button:hover {
  background-color: #00a3da;
}

.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9); 
  color: #ffffff; 
  padding: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  z-index: 10;
  border-radius: 5px;
  border: none; 
}

.tooltip div {
  margin-bottom: 14px;
}

.deadline-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.deadline-form {
  background: #1e1e2d;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.deadline-form h3 {
  margin-top: 0;
  color: white;
}

.deadline-form label {
  display: block;
  margin-bottom: 5px;
  color: white;
}

.deadline-form input,
.deadline-form select {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid #00bfff;
  background: #1e1e2d;
  color: white;
}

.deadline-form button {
  margin-right: 10px;
  background: #00bfff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
}
</style>