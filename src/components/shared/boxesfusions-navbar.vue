<template>
    <b-navbar toggleable="md" type="dark" variant="dark">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand href="#">fiberfy</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item
                    href="#"
                    :active="boxesActive"
                    @click="goRoute($event, 'BoxesEdit', site)"
                    >{{ $t('menu.boxes') }}</b-nav-item
                >
                <b-nav-item
                    href="#"
                    :active="editFusionsActive"
                    @click="goRoute($event, 'FusionsEdit', site)"
                    >{{ $t('menu.editFusions') }}</b-nav-item
                >
                <b-nav-item
                    href="#"
                    :active="showFusionsActive"
                    @click="goRoute($event, 'FusionsShow', site)"
                    >{{ $t('menu.showFusions') }}</b-nav-item
                >
                <b-nav-item href="#" @click="goRoute($event, 'Map', null)">{{
                    $t('menu.back')
                }}</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>
<script>
export default {
    name: 'boxesfusions-navbar',
    props: ['boxesActive', 'editFusionsActive', 'showFusionsActive'],
    data() {
        return {
            site: this.$route.params.id,
        };
    },
    methods: {
        goRoute(evt, name, id) {
            evt.preventDefault();
            this.$router.push({ name: name, params: { id: id } });
        },
    },
};
</script>
