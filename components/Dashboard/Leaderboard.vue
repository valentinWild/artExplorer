<template>
  <div class="leaderboard-card">
    <h1>Leaderboard</h1>
    <UTable :sort="sort" :columns="columns" :rows="users" class="table"/>
  </div>
</template>

<script setup>

const sort = ref({
  column: 'firstname',
  direction: 'asc'
});

const columns = [
  { label: 'First Name', key: 'firstname', sortable: true },
  { label: 'Last Name', key: 'lastname', sortable: true },
  { label: 'Mean Score', key: 'mean_score', sortable: true }
];

const users = ref(0);

const props = defineProps({
  usersInfoData: {
      type: Object,
      required: true,
    },
  });

  users.value = props.usersInfoData;
</script>

<style scoped>  
h1 {
  font-size: 2em;
  font-weight: bold;
  color: black;
}
.leaderboard-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: white;
    border: 2px solid white;
    border-radius: 10px;
    color:aquamarine;
  }

  .table {
    width: 100%;
    margin-top: 20px;
    color: white;
  }
</style>