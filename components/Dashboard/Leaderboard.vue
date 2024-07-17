<template>
  <h1>Leaderboard</h1>
  <UTable :sort="sort" :columns="columns" :rows="users"/>
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
  color: white;
}
table {
  background-color: aliceblue;
}
tr {
  background-color: white;
  color: black;
}
td {
  background-color: white;
  color: white;
  font-weight: bold;
}
</style>