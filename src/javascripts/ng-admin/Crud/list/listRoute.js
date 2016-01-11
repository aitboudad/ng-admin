import listTemplate from './list.html';
import { viewProvider } from '../routingHelper.js';
import DataStore from 'admin-config/lib/DataStore/DataStore';
import Entry from 'admin-config/lib/Entry';

export default {
    url: '?{search:json}&{page:int}&sortField&sortDir',
    name: 'list',
    params: {
        page: { value: 1, squash: true },
        search: { value: {}, squash: true },
        sortField: null,
        sortDir: null
    },
    parent: 'listLayout',
    views: {
        grid: {
            controller: 'ListController',
            controllerAs: 'listController',
            template: listTemplate,
            resolve: {
                dataStore: () => new DataStore(),
                view: viewProvider('ListView'),
                response: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                    var page = $stateParams.page,
                        filters = $stateParams.search,
                        sortField = $stateParams.sortField,
                        sortDir = $stateParams.sortDir;

                    return ReadQueries.getAll(view, page, filters, sortField, sortDir);
                }],
                totalItems: ['response', function (response) {
                    return response.totalItems;
                }],
                referenceData: ['ReadQueries', 'view', 'response', function (ReadQueries, view, response) {
                    return ReadQueries.getReferenceData(view.fields(), response.data);
                }],
                referenceEntries: ['dataStore', 'view', 'referenceData', function (dataStore, view, referenceData) {
                    const references = view.getReferences();
                    for (var name in referenceData) {
                        Entry.createArrayFromRest(
                            referenceData[name],
                            [references[name].targetField()],
                            references[name].targetEntity().name(),
                            references[name].targetEntity().identifier().name()
                        ).map(entry => dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry));
                    }
                }],
                entries: ['dataStore', 'view', 'response', function (dataStore, view, response) {
                    var entries = view.mapEntries(response.data);

                    // shortcut to diplay collection of entry with included referenced values
                    dataStore.fillReferencesValuesFromCollection(entries, view.getReferences(), true);

                    // set entries here ???
                    dataStore.setEntries(
                        view.getEntity().uniqueId,
                        entries
                    );

                    return entries;
                }],
                prepare: ['view', '$stateParams', 'dataStore', 'entries', '$window', '$injector', function(view, $stateParams, dataStore, entries, $window, $injector) {
                    return view.prepare() && $injector.invoke(view.prepare(), view, {
                        query: $stateParams,
                        datastore: dataStore,
                        view,
                        Entry,
                        entries,
                        window: $window
                    });
                }],
            },

        }
    }
};
