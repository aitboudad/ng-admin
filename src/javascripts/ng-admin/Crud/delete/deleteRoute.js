import deleteTemplate from './delete.html';
import deleteModalTemplate from './deleteModal.html';

import { templateProvider, viewProvider } from '../routingHelper.js';
import DataStore from 'admin-config/lib/DataStore/DataStore';
import Entry from 'admin-config/lib/Entry';

export default {
    name: 'delete',
    parent: 'main',
    url: '/:entity/delete/:id',
    controller: 'DeleteController',
    modalController: 'ModalDeleteController',
    controllerAs: 'deleteController',
    template: deleteTemplate,
    templateModal: deleteModalTemplate,
    templateProvider: templateProvider('DeleteView', deleteTemplate),
    params: {
        page: {
            value: 1,
            squash: true
        },
        search: {
            value: {},
            squash: true
        },
        sortField: null,
        sortDir: null
    },
    resolve: {
        dataStore: () => new DataStore(),
        view: viewProvider('DeleteView'),
        params: ['$stateParams', function($stateParams) {
            return $stateParams;
        }],
        rawEntry: ['$stateParams', 'ReadQueries', 'view', function($stateParams, ReadQueries, view) {
            return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl());
        }],
        entry: ['view', 'rawEntry', function(view, rawEntry) {
            return view.mapEntry(rawEntry);
        }],
        prepare: ['view', '$stateParams', 'dataStore', 'entry', '$window', '$injector', function(view, $stateParams, dataStore, entry, $window, $injector) {
            return view.prepare() && $injector.invoke(view.prepare(), view, {
                query: $stateParams,
                datastore: dataStore,
                view,
                Entry,
                entry,
                window: $window
            });

        }],
    }
};
