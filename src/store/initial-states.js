export default {
    user() {
        return {
            user: {
                id: null,
                name: '',
                token: '',
            },
            locale: 'ca',
        };
    },
    projects() {
        return {
            current: {
                id: null,
                name: '',
                latitude: 0.0,
                longitude: 0.0,
                zoom: 0,
                writable: true,
                defaultZone: {
                    id: null,
                },
            },
            list: [],
        };
    },
    map() {
        return {
            latitude: 0.0,
            longitude: 0.0,
            zoom: 1,
            layer: 'civil',
            base: {
                tiles: [],
                wms: [],
            },
            overlay: {
                wms: [],
            },
            selectedOverlayTiles: [],
            selectedBaseTile: 0,
            selectedBaseWMS: 0,
            baseSelected: 'tiles',
        };
    },
    paths() {
        return {
            paths: [],
            types: ['aerial', 'facade', 'underground', 'notdefined'],
        };
    },
    sites() {
        return {
            sites: [],
            types: [
                'notdefined',
                'manhole',
                'pole',
                'room',
                'cabinet',
                'poe',
                'hook',
                'jump',
            ],
        };
    },
    boxes() {
        return {
            sites: {},
            boxes: {},
            types: ['mainline', 'CTO', 'splitter', 'patchpanel'],
        };
    },
    cables() {
        return {
            cables: {},
            sites: {},
        };
    },
    tubes() {
        return {
            cables: {},
            tubes: {},
        };
    },
    fibers() {
        return {
            tubes: {},
            fibers: {},
        };
    },
    fusions() {
        return {
            fibers: {},
            boxes: {},
            fusions: {
                fibers: {},
                boxes: {},
                data: {},
            },
        };
    },
    templates() {
        return {
            fiberTemplates: [],
            statusList: [
                'Planned',
                'Reserved',
                'Building',
                'Testing',
                'Working',
                'Dropped',
                'Inactive',
            ],
        };
    },
};
