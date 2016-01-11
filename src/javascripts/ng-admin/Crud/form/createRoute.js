import createTemplate from './create.html';
import createModalTemplate from './createModal.html';
import { templateProvider, viewProvider } from '../routingHelper.js';
import DataStore from 'admin-config/lib/DataStore/DataStore';
import Entry from 'admin-config/lib/Entry';

export default {
    name: 'create',
    parent: 'main',
    url: '/:entity/create?{defaultValues:json}',
    controller: 'FormController',
    modalController: 'ModalFormController',
    controllerAs: 'formController',
    templateModal: createModalTemplate,
    templateProvider: templateProvider('CreateView', createTemplate),
    params: {
        page: { value: 1, squash: true },
        search: { value: {}, squash: true },
        defaultValues: { value: {}, squash: true },
        sortField: null,
        sortDir: null
    },
    resolve: {
        dataStore: () => new DataStore(),
        view: viewProvider('CreateView'),
        entry: ['$stateParams', 'dataStore', 'view', function ($stateParams, dataStore, view) {
            var entry = Entry.createForFields(view.getFields(), view.entity.name());
            Object.keys($stateParams.defaultValues).forEach(key => entry.values[key] = $stateParams.defaultValues[key]);
            dataStore.addEntry(view.getEntity().uniqueId, entry);

            return entry;
        }],
        choiceData: ['ReadQueries', 'view', function (ReadQueries, view) {
            return ReadQueries.getAllReferencedData(view.getReferences(false));
        }],
        choiceEntries: ['dataStore', 'view', 'choiceData', function (dataStore, view, filterData) {
            const choices = view.getReferences(false);
            for (var name in filterData) {
                Entry.createArrayFromRest(
                    filterData[name],
                    [choices[name].targetField()],
                    choices[name].targetEntity().name(),
                    choices[name].targetEntity().identifier().name()
                ).map(entry => dataStore.addEntry(choices[name].targetEntity().uniqueId + '_choices', entry));
            }
        }],
        prepare: ['view', '$stateParams', 'dataStore', 'entry', 'choiceEntries', '$window', '$injector', function(view, $stateParams, dataStore, entry, choiceEntries, $window, $injector) {
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
