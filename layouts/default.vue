<template>
    <div class="default">
      <LayoutHeader class="header"/>
      <main>
        <NuxtPage />
      </main>
      <LayoutFooter class="footer"/>
    </div>
</template>

<style scoped>

.default {
    display: grid;
    grid-template-columns: 1fr 100% 1fr;
}

main {
    grid-column: 2;
}

.header,
.footer {
    grid-column: -1/1;
}

</style>