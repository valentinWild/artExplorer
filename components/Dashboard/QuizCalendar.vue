<template>
    <div>
      <h3>My Contributions</h3>
      <div>
        <label for="year-select">Select Year:</label>
        <select id="year-select" v-model="selectedYear" @change="initCalendar">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="calendar">
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
                    :class="getQuizCountClass(day.quizCount)"
                    @mouseover="showTooltip(day)" 
                    @mouseleave="hideTooltip"
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
      </div>
      <div v-if="tooltip.visible" class="tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
        <div>{{ tooltip.date }}</div>
        <div v-if="tooltip.quizCount !== null">Quizzes: {{ tooltip.quizCount }}</div>
        <div v-else>No Quizzes</div>
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
  
  const tooltip = ref({
    visible: false,
    date: '',
    quizCount: null,
    x: 0,
    y: 0
  });
  
  const getWeeksInMonth = (month, year) => {
    const weeks = [];
    let date = new Date(year, month, 1);
    let week = { index: 0, days: [] };
  
    while (date.getMonth() === month) {
      if (date.getDay() === 0 && week.days.length) {
        weeks.push(week);
        week = { index: week.index + 1, days: [] };
      }
  
      week.days.push({ date: new Date(date), quizCount: 0 });
      date.setDate(date.getDate() + 1);
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
      if (date.getFullYear() === selectedYear.value) {
        const monthIndex = date.getMonth();
        const month = months.value[monthIndex];
        month.weeks.forEach(week => {
          week.days.forEach(day => {
            if (day.date.toDateString() === date.toDateString()) {
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
  
  const showTooltip = (day) => {
    tooltip.value.visible = true;
    tooltip.value.date = day.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    tooltip.value.quizCount = day.quizCount;
    tooltip.value.x = event.clientX + 10;
    tooltip.value.y = event.clientY + 10;
  };
  
  const hideTooltip = () => {
    tooltip.value.visible = false;
  };
  
  onMounted(() => {
    initCalendar();
  });
  
  watch(selectedYear, initCalendar);
  </script>
  
  <style scoped>
  h3 {
    font-weight: 600;
  }
  
  label {
    margin-right: 10px;
  }
  
  select {
    margin-bottom: 20px;
  }
  
  .calendar {
    display: flex;
    flex-direction: column;
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
  }
  
  .light-green {
    background-color: #d4edda;
  }
  
  .middle-green {
    background-color: #a8e0a3;
  }
  
  .dark-green {
    background-color: #74c476;
  }
  
  .legend {
    display: flex;
    margin-top: 20px;
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
  
  .tooltip {
    position: absolute;
    background-color: white;
    border: 1px solid #ddd;
    padding: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    z-index: 10;
  }
  </style>