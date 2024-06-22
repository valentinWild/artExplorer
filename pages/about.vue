<template>
    <div>
        <h1>About Page</h1>
    </div>
    Random Number:<span>{{ randomString }}</span>
    <Test></Test>
</template>

<script setup>
const {data: randomString} = await useFetch('/api/randomString/');


</script>