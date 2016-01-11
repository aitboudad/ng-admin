import batchDeleteTemplate from './batchDelete.html';
import batchDeleteModalTemplate from './batchDeleteModal.html';
import {templateProvider, viewProvider } from '../routingHelper.js';

export default {
    name: 'batchDelete',
    parent: 'main',
    url: '/:entity/batch-delete/{ids:json}',
    controller: 'BatchDeleteController',
    modalController: 'ModalBatchDeleteController',
    controllerAs: 'batchDeleteController',
    template: batchDeleteTemplate,
    templateModal: batchDeleteModalTemplate,
    templateProvider: templateProvider('BatchDeleteView', batchDeleteTemplate),
    params: {
        entity: null,
        ids: [],
        page: { value: 1, squash: true },
        search: { value: {}, squash: true },
        sortField: null,
        sortDir: null
    },
    resolve: {
        view: viewProvider('BatchDeleteView'),
        params: ['$stateParams', function ($stateParams) {
            return $stateParams;
        }]
    }
};
