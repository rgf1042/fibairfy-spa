<template>
    <b-container>
        <div>
            <!-- Modal Component -->
            <b-modal
                id="modal-delete-project"
                ref="deleteModalRef"
                @ok="deleteProject"
                @cancel="noDeleteProject"
                @esc="noDeleteProject"
                @backdrop="noDeleteProject"
                @headerclose="noDeleteProject"
                title="Esborrar projecte"
            >
                <p class="my-4">
                    Segur que vol esborrar el site: {{ deleted.name }}
                </p>
            </b-modal>
        </div>
        <b-row>
            <b-col class="pt-1">
                <b-alert
                    :variant="alert.variant"
                    dismissible
                    :show="alert.show"
                    @dismissed="alert.show = false"
                >
                    {{ alert.message }}
                </b-alert>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="2" class="pt-2">
                <h2>{{ $t('menu.projects') }}</h2>
            </b-col>
        </b-row>
        <b-row class="pt-2">
            <project-selected :loading="loading"></project-selected>
        </b-row>
        <b-row class="pt-5">
            <b-col cols="10">
                <h3>{{ $t('components.projects.list') }}</h3>
            </b-col>
            <b-col>
                <b-button
                    type="button"
                    variant="success"
                    :to="{ name: 'ProjectAdd' }"
                >
                    {{ $t('components.projects.projectAdd.name') }}
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col><hr /></b-col>
        </b-row>
        <b-row class="py-4">
            <fiberfy-search
                :url="projectUrl"
                type="remote"
                selectedField="name"
                populate="users, defaultZone"
                :caption="this.$t('general.name') + ':'"
                ref="browser"
                v-model="searchList"
            ></fiberfy-search>
        </b-row>
        <b-row
            class="pt-3"
            v-for="(project) in list"
            :key="project.id"
        >
            <b-col sm="2">
                <span>{{ project.name }}</span>
                <span v-if="!project.writable"
                    >({{ $t('components.projects.readonly') }})</span
                >
            </b-col>
            <b-col sm="4">
                <project-buttons
                    :project="project"
                    :current="current"
                    :loading="loading"
                >
                </project-buttons>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
/* eslint-disable */
import ProjectButtons from '@/components/Projects/project-buttons';
import ProjectSelected from '@/components/Projects/project-selected';
import FiberfySearch from '@/components/shared/fiberfy-search';

export default {
    name: 'Projects',
    components: {
        'project-buttons': ProjectButtons,
        'project-selected': ProjectSelected,
        'fiberfy-search': FiberfySearch,
    },
    mounted() {
        this.$bus.$on('activate-project', this.activateProject);
        this.$bus.$on('deactivate-project', this.deactivateProject);
        this.$bus.$on('save-pos', this.savePos);
        this.$bus.$on('delete-project', this.questionDeleteProject);
    },
    destroyed() {
        this.$bus.$off('activate-project', this.activateProject);
        this.$bus.$off('deactivate-project', this.deactivateProject);
        this.$bus.$off('save-pos', this.savePos);
        this.$bus.$off('delete-project', this.questionDeleteProject);
    },
    data() {
        return {
            loading: false,
            deleted: {
                id: 0,
            },
            alert: {
                show: false,
                message: '',
                variant: 'info',
            },
            searchList: null,
            projectUrl:
                this.$store.getters['constants/constants']['baseUrl'] +
                '/project/', // eslint-disable-line
        };
    },
    computed: {
        current() {
            return this.$store.state.projects.current;
        },
        list() {
            if (this.searchList) {
                for (let x in this.searchList.content) {
                    this.searchList.content[x].writable =
                        typeof this.searchList.content[x].users.find(
                            item =>
                                item.id ===
                                this.$store.getters['user/currentId']
                        ) === 'object';
                }
                return this.searchList.content;
            } else return this.$store.state.projects.list;
        },
    },
    methods: {
        activateProject(id) {
            this.loading = true; // We set to true loading data used in props communication
            this.$bus.$emit('lock-menu');
            this.$store.dispatch('projects/setCurrent', id).then(
                response => {
                    this.loading = false;
                    this.$bus.$emit('unlock-menu');
                },
                error => {
                    this.loading = false;
                    this.$bus.$emit('unlock-menu');
                    console.log(error);
                    this.alert.message = error.body;
                    this.alert.variant = 'danger';
                    this.alert.show = true;
                }
            );
        },
        deactivateProject() {
            this.$store.dispatch('projects/unsetCurrent');
        },
        savePos() {
            this.$store.dispatch('projects/savePos').then(
                response => {
                    this.alert.message = 'New position correctly saved';
                    this.alert.variant = 'info';
                    this.alert.show = true;
                },
                error => {
                    /* if (error.body.message) {
          this.alert.message = error.body.message
          this.alert.show = true
        } */
                    console.log(error);
                    this.alert.message = error.body;
                    this.alert.show = true;
                    this.alert.variant = 'danger';
                }
            );
        },
        questionDeleteProject(id) {
            this.$store
                .dispatch('projects/findProjectById', id)
                .then(response => {
                    let project = response;
                    this.deleted = project; // Marquem id a esborrar
                    this.$refs.deleteModalRef.show();
                });
        },
        noDeleteProject() {
            this.deleted = {};
            this.$refs.deleteModalRef.hide();
        },
        deleteProject() {
            this.$store
                .dispatch('projects/deleteProject', this.deleted.id)
                .then(
                    response => {
                        this.deleted = {}; // Esborrem referencia
                        this.$refs.browser.search(); //
                    },
                    error => {
                        this.deleted = {}; // Esborrem referencia
                        console.log(error);
                        this.alert.message = error.body;
                        this.alert.variant = 'danger';
                        this.alert.show = true;
                    }
                );
        },
    },
};
</script>
