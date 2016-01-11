import listLayoutTemplate from './listLayout.html';
import { templateProvider, viewProvider } from '../routingHelper.js';
import DataStore from 'admin-config/lib/DataStore/DataStore';
import Entry from 'admin-config/lib/Entry';

export default {
    name: 'listLayout',
    abstract: true,
    url: '/:entity/list',
    params: {
        entity: null
    },
    parent: 'main',
    controller: 'ListLayoutController',
    controllerAs: 'llCtrl',
    templateProvider: templateProvider('ListView', listLayoutTemplate),
    resolve: {
        dataStore: () => new DataStore(),
        view: viewProvider('ListView'),
        filterData: ['ReadQueries', 'view', function (ReadQueries, view) {
            return ReadQueries.getAllReferencedData(view.getFilterReferences(false));
        }],
        filterEntries: ['dataStore', 'view', 'filterData', function (dataStore, view, filterData) {
            const filters = view.getFilterReferences(false);
            for (var name in filterData) {
                Entry.createArrayFromRest(
                    filterData[name],
                    [filters[name].targetField()],
                    filters[name].targetEntity().name(),
                    filters[name].targetEntity().identifier().name()
                ).map(entry => dataStore.addEntry(filters[name].targetEntity().uniqueId + '_choices', entry));
            }
        }]
    }
};
