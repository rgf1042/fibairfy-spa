<template>
    <div>
        <b-row>
            <b-col cols="3">
                <h4>Cable: {{ id }} - {{ name }}</h4>
            </b-col>
        </b-row>
        <b-row class="pt-2">
            <b-col cols="1"><label>Tubs:</label></b-col>
        </b-row>
        <div class="pt-1" v-for="(tubeId, index) in tubes" :key="tubeId">
            <b-row>
                <b-col>{{ tube(tubeId).color }}</b-col>
            </b-row>
            <b-row
                class="pt-1"
                v-for="(fiberId, index) in fibers(tubeId)"
                :key="fiberId"
            >
                <b-col>{{ fiberId }}</b-col>
                <b-col
                    ><fusion-fibers :id="fiberId" type="fiber"></fusion-fibers
                ></b-col>
            </b-row>
        </div>
    </div>
</template>
<script>
import FusionFibers from './fusion-fibers';

export default {
    name: 'fusion-cables',
    props: ['id'],
    components: {
        'fusion-fibers': FusionFibers,
    },
    data() {
        return {
            name: null,
        };
    },
    mounted() {
        this.name = this.$store.getters['projects/findCableById'](this.id).name;
    },
    computed: {
        tubes() {
            return this.$store.getters['projects/tubesIndexes'](this.id);
        },
    },
    methods: {
        tube(id) {
            return this.$store.getters['projects/findTubeById'](id);
        },
        fibers(id) {
            return this.$store.getters['projects/fibersIndexes'](id);
        },
    },
};
</script>
