<template>
    <div>
        <b-modal
            id="modal-delete-path"
            ref="deleteModalRef"
            @ok="deletePath"
            @cancel="noDeletePath"
            @esc="noDeletePath"
            @backdrop="noDeletePath"
            @headerclose="noDeletePath"
            :title="$t('components.editPaths.deleteTitle')"
        >
            <p class="my-4">
                {{ $t('components.editPaths.deleteMsg') }}: {{ deleted.name }}
            </p>
        </b-modal>
        <b-container>
            <b-row>
                <b-col class="pt-1">
                    <b-alert
                        variant="danger"
                        dismissible
                        :show="alert.show"
                        @dismissed="alert.show = false"
                    >
                        {{ alert.message }}
                    </b-alert>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="4" class="pt-2">
                    <h2>
                        {{ $t('components.editPaths.title') }}: {{ form.id }}
                    </h2>
                </b-col>
            </b-row>
            <b-form @submit="onSubmit">
                <b-form-group
                    id="nameInputGroup"
                    :label="this.$t('general.name') + ':'"
                    label-for="nameInput"
                >
                    <b-form-input
                        id="nameInput"
                        type="text"
                        v-model="form.name"
                        required
                        placeholder="Enter name"
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group
                    id="iniSiteInputGroup"
                    :label="this.$t('components.editPaths.first') + ':'"
                    label-for="iniSiteInput"
                >
                    <fiberfy-autocomplete
                        type="local"
                        :inputData="this.sites"
                        selectedField="name"
                        returnedField="id"
                        required="true"
                        v-model="form.first"
                    />
                </b-form-group>
                <b-form-group
                    id="lastSiteInputGroup"
                    :label="this.$t('components.editPaths.second') + ':'"
                    label-for="lastSiteInput"
                >
                    <fiberfy-autocomplete
                        type="local"
                        :inputData="this.sites"
                        selectedField="name"
                        returnedField="id"
                        required="true"
                        v-model="form.last"
                    />
                </b-form-group>
                <b-form-group
                    id="distanceInputGroup"
                    :label="this.$t('general.distance') + ':'"
                    label-for="distanceInput"
                >
                    <b-form-input
                        id="distanceInput"
                        type="text"
                        v-model="distance"
                        disabled
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group
                    id="typeInputGroup"
                    :label="this.$t('general.type') + ':'"
                    label-for="typeInput"
                >
                    <b-form-select
                        id="typeInput"
                        v-model="form.type"
                        :options="types"
                        class="mb-3"
                    />
                </b-form-group>
                <b-form-group
                    id="statusInputGroup"
                    :label="this.$t('general.status') + ':'"
                    label-for="statusInput"
                >
                    <b-form-select
                        id="statusInput"
                        v-model="form.status"
                        :options="statusList"
                        class="mb-3"
                    />
                </b-form-group>
                <b-form-group
                    id="observationsInputGroup"
                    :label="this.$t('general.observations') + ':'"
                    label-for="observationsInput"
                >
                    <b-form-textarea
                        id="observationsInput"
                        v-model="form.observations"
                        placeholder="Observacions"
                        :rows="3"
                        :max-rows="6"
                    >
                    </b-form-textarea>
                </b-form-group>
                <b-button
                    type="submit"
                    variant="primary"
                    :disabled="!this.current.writable"
                    >{{ $t('general.update') }}</b-button
                >
                <b-button
                    type="button"
                    variant="danger"
                    :disabled="!this.current.writable"
                    @click="onDelete"
                    >{{ $t('general.delete') }}</b-button
                >
            </b-form>
        </b-container>
    </div>
</template>
<script>
import FiberfyAutocomplete from '@/components/shared/fiberfy-autocomplete';

export default {
    name: 'PathEdit',
    components: {
        'fiberfy-autocomplete': FiberfyAutocomplete,
    },
    data() {
        return {
            distance: null,
            form: {
                id: 0,
                name: '',
                first: 0,
                last: 0,
                type: '',
                status: '',
                observations: '',
            },
            alert: {
                show: false,
                message: '',
            },
            deleted: {
                id: 0,
            },
        };
    },
    mounted() {
        this.$store
            .dispatch('projects/findPathById', this.$route.params.id)
            .then(
                response => {
                    let path = response;
                    this.form.id = path.id;
                    this.form.name = path.name;
                    this.form.first = path.first.id;
                    this.form.last = path.last.id;
                    this.form.type = path.type;
                    this.form.status = path.status;
                    this.form.observations = path.observations;
                    this.distance =
                        path.distance + ' ' + this.$t('general.metrics.meters');
                },
                error => {
                    this.alert.message = error;
                    this.alert.show = true;
                    console.log(error);
                }
            );
    },
    computed: {
        types() {
            let output = [];
            let types = this.$store.state.projects.paths.types;
            for (let x in types) {
                output[x] = {
                    value: types[x],
                    text: this.$t('content.pathTypes.' + types[x]),
                };
            }
            return output;
        },
        sites() {
            return this.$store.state.projects.sites.sites;
        },
        statusList() {
            let output = [];
            let statusList = this.$store.state.templates.statusList;
            for (let x in statusList) {
                output[x] = {
                    value: statusList[x],
                    text: this.$t('general.statusList.' + statusList[x]),
                };
            }
            return output;
        },
        current() {
            return this.$store.getters['projects/current'];
        },
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            this.$store.dispatch('projects/updatePath', this.form).then(
                response => {
                    this.$router.go(-1);
                },
                error => {
                    this.alert.message = error.msg;
                    this.alert.show = true;
                    console.log(error);
                }
            );
        },
        onDelete(evt) {
            evt.preventDefault();
            this.deleted = this.form;
            this.$refs.deleteModalRef.show();
        },
        noDeletePath() {
            this.deleted = {};
            this.$refs.deleteModalRef.hide();
        },
        deletePath() {
            this.$store.dispatch('projects/deletePath', this.deleted.id).then(
                response => {
                    this.deleted = {}; // Esborrem referencia
                    this.$router.go(-1);
                },
                error => {
                    this.alert.message = error.msg;
                    this.alert.show = true;
                    this.deleted = {}; // Esborrem referencia
                    console.log(error);
                }
            );
        },
    },
};
</script>
