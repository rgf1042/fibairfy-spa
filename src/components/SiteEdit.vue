<template>
    <div>
        <b-modal
            id="modal-delete-site"
            ref="deleteModalRef"
            @ok="deleteSite"
            @cancel="noDeleteSite"
            @esc="noDeleteSite"
            @backdrop="noDeleteSite"
            @headerclose="noDeleteSite"
            :title="this.$t('components.editSites.deleteTitle')"
        >
            <p class="my-4">
                {{ $t('components.editSites.deleteMsg') }}: {{ deleted.name }}
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
                        {{ $t('components.editSites.title') }}: {{ form.id }}
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
                    id="locationInputGroup"
                    :label="this.$t('general.location') + ':'"
                    label-for="latitudeInput"
                >
                    <b-form-input
                        id="latitudeInput"
                        type="text"
                        v-model="form.latitude"
                        required
                        placeholder="Enter latitude"
                    >
                    </b-form-input>
                    <b-form-input
                        id="longitudeInput"
                        type="text"
                        v-model="form.longitude"
                        required
                        placeholder="Enter longitude"
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
                    id="zoneInputGroup"
                    :label="this.$t('general.zone') + ':'"
                    label-for="zoneInput"
                >
                    <fiberfy-autocomplete
                        type="remote"
                        :url="this.zoneUrl"
                        selectedField="title"
                        returnedField="id"
                        required="true"
                        v-model="form.zone"
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
    name: 'SiteEdit',
    components: {
        'fiberfy-autocomplete': FiberfyAutocomplete,
    },
    data() {
        return {
            form: {
                id: 0,
                name: '',
                latitude: '',
                longitude: '',
                type: '',
                status: '',
                zone: null,
                observations: '',
            },
            alert: {
                show: false,
                message: '',
            },
            deleted: {
                id: 0,
            },
            zoneUrl:
                fiberfy.constants.BASE_URL +
                fiberfy.constants.API_VERSION +
                '/zone/', // eslint-disable-line
        };
    },
    created() {
        this.$store
            .dispatch('projects/findSiteById', this.$route.params.id)
            .then(
                response => {
                    let site = response;
                    this.form.id = site.id;
                    this.form.name = site.name;
                    this.form.latitude = site.latitude;
                    this.form.longitude = site.longitude;
                    this.form.type = site.type;
                    this.form.status = site.status;
                    this.form.zone = site.zone;
                    this.form.observations = site.observations;
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
            let types = this.$store.state.projects.sites.types;
            for (let x in types) {
                output[x] = {
                    value: types[x],
                    text: this.$t('content.siteTypes.' + types[x]),
                };
            }
            return output;
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
            this.$store.dispatch('projects/updateSite', this.form).then(
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
        noDeleteSite() {
            this.deleted = {};
            this.$refs.deleteModalRef.hide();
        },
        deleteSite() {
            this.$store.dispatch('projects/deleteSite', this.deleted.id).then(
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
