import listLayoutRoute from './list/listLayoutRoute.js';
import listRoute from './list/listRoute.js';
import showRoute from './show/showRoute.js';
import editRoute from './form/editRoute.js';
import createRoute from './form/createRoute.js';
import deleteRoute from './delete/deleteRoute.js';
import batchDeleteRoute from './delete/batchDeleteRoute.js';

function routing($stateProvider, $uibResolveProvider) {
    $uibResolveProvider.setResolver('$resolve');
    $stateProvider
        .state(listLayoutRoute)
        .state(listRoute);

    $stateProvider.state(showRoute);
    $stateProvider.state(createRoute);
    $stateProvider.state(editRoute);
    $stateProvider.state(deleteRoute);
    $stateProvider.state(batchDeleteRoute);

    [showRoute, createRoute, editRoute, deleteRoute, batchDeleteRoute].forEach((route) => {
        $stateProvider
            .state(route.name+'Popup', {
                parent: 'list',
                url: route.url,
                params: route.params,
                onEnter: ['$uibModal', '$state', function($modal, $state) {
                    $modal.open({
                        controller: route.modalController || route.controller,
                        controllerAs: route.controllerAs,
                        resolve: route.resolve,
                        template: route.templateModal || route.template,
                    }).result.finally(function() {
                        $state.go('^', {}, {reload: true});
                    });
                }],
            });
    });
}

routing.$inject = ['$stateProvider', '$uibResolveProvider'];

export default routing;
