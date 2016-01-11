import editTemplate from './edit.html';
import editModalTemplate from './editModal.html';
import { templateProvider, viewProvider } from '../routingHelper.js';
import DataStore from 'admin-config/lib/DataStore/DataStore';
import Entry from 'admin-config/lib/Entry';

export default {
    name: 'edit',
    parent: 'main',
    url: '/:entity/edit/:id?sortField&sortDir',
    controller: 'FormController',
    modalController: 'ModalFormController',
    controllerAs: 'formController',
    templateModal: editModalTemplate,
    templateProvider: templateProvider('EditView', editTemplate),
    params: {
        entity: null,
        id: null,
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
        view: viewProvider('EditView'),
        rawEntry: ['$stateParams', 'ReadQueries', 'view', function($stateParams, ReadQueries, view) {
            return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl());
        }],
        entry: ['view', 'rawEntry', function(view, rawEntry) {
            return view.mapEntry(rawEntry);
        }],
        referenceData: ['ReadQueries', 'view', 'entry', function(ReadQueries, view, entry) {
            return ReadQueries.getReferenceData(view.fields(), [entry.values]);
        }],
        referenceEntries: ['dataStore', 'view', 'referenceData', function(dataStore, view, referenceData) {
            const references = view.getReferences();
            for (var name in referenceData) {
                Entry.createArrayFromRest(
                    referenceData[name], [references[name].targetField()],
                    references[name].targetEntity().name(),
                    references[name].targetEntity().identifier().name()
                ).map(entry => dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry));
            }
        }],
        referencedListData: ['$stateParams', 'ReadQueries', 'view', 'entry', function($stateParams, ReadQueries, view, entry) {
            return ReadQueries.getReferencedListData(view.getReferencedLists(), $stateParams.sortField, $stateParams.sortDir, entry.identifierValue);
        }],
        referencedListEntries: ['dataStore', 'view', 'referencedListData', function(dataStore, view, referencedListData) {
            const referencedLists = view.getReferencedLists();
            for (var name in referencedLists) {
                Entry.createArrayFromRest(
                    referencedListData[name],
                    referencedLists[name].targetFields(),
                    referencedLists[name].targetEntity().name(),
                    referencedLists[name].targetEntity().identifier().name()
                ).map(entry => dataStore.addEntry(referencedLists[name].targetEntity().uniqueId + '_list', entry));
            }
        }],
        entryWithReferences: ['dataStore', 'view', 'entry', function(dataStore, view, entry) {
            dataStore.fillReferencesValuesFromEntry(entry, view.getReferences(), true);
            dataStore.addEntry(view.getEntity().uniqueId, entry);
        }],
        choiceData: ['ReadQueries', 'view', function(ReadQueries, view) {
            return ReadQueries.getAllReferencedData(view.getReferences(false));
        }],
        choiceEntries: ['dataStore', 'view', 'choiceData', function(dataStore, view, filterData) {
            const choices = view.getReferences(false);
            for (var name in filterData) {
                Entry.createArrayFromRest(
                    filterData[name], [choices[name].targetField()],
                    choices[name].targetEntity().name(),
                    choices[name].targetEntity().identifier().name()
                ).map(entry => dataStore.addEntry(choices[name].targetEntity().uniqueId + '_choices', entry));
            }
        }],
        referenceDataForReferencedLists: ['$q', 'ReadQueries', 'view', 'referencedListData', function($q, ReadQueries, view, referencedListData) {
            const referencedLists = view.getReferencedLists();
            var promises = {};
            Object.keys(referencedLists).map(name => {
                promises[name] = ReadQueries.getReferenceData(referencedLists[name].targetFields(), referencedListData[name]);
            });
            return $q.all(promises);
        }],
        referenceEntriesForReferencedLists: ['dataStore', 'view', 'referenceDataForReferencedLists', function(dataStore, view, referenceDataForReferencedLists) {
            const referencedLists = view.getReferencedLists();
            Object.keys(referencedLists).map(referencedListName => {
                const references = referencedLists[referencedListName].getReferences();
                for (var name in references) {
                    if (!referenceDataForReferencedLists[referencedListName][name]) {
                        continue;
                    }
                    Entry.createArrayFromRest(
                        referenceDataForReferencedLists[referencedListName][name], [references[name].targetField()],
                        references[name].targetEntity().name(),
                        references[name].targetEntity().identifier().name()
                    ).map(entry => dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry));
                }
            });
            return true;
        }],
        prepare: ['view', '$stateParams', 'dataStore', 'entry', 'referenceEntriesForReferencedLists', 'choiceEntries', 'entryWithReferences', '$window', '$injector', function(view, $stateParams, dataStore, entry, referenceEntriesForReferencedLists, choiceEntries, entryWithReferences, $window, $injector) {
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
