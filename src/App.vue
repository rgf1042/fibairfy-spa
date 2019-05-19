<template>
    <div id="app">
        <router-view name="navbar" />
        <router-view name="view" />
    </div>
</template>

<script>
export default {
    name: 'app',
    async created() {
        const constants = await this.$http.get('constants.json');
        this.$store.dispatch('constants/setConstants', constants['body']);
    }
};
</script>
<style></style>
