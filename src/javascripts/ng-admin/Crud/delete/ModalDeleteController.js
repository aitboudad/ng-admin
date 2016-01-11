import DeleteController from './DeleteController';

export default class ModalDeleteController extends DeleteController {
    constructor($scope, $window, $state, $q, WriteQueries, notification, params, view, entry, $uibModalInstance) {
        super($scope, $window, $state, $q, WriteQueries, notification, params, view, entry);
        this.$uibModalInstance = $uibModalInstance;
    }

    deleteOne() {
        var notification = this.notification,
            entityName = this.entity.name();

        return this.WriteQueries.deleteOne(this.view, this.entityId)
            .then(
                () => {
                    this.$uibModalInstance.close();
                    notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });
                },
                response => {
                    // @TODO: share this method when splitting controllers
                    var body = response.data;
                    if (typeof body === 'object') {
                        body = JSON.stringify(body);
                    }

                    notification.log('Oops, an error occured : (code: ' + response.status + ') ' + body, {addnCls: 'humane-flatty-error'});
                }
            );
    }

    back() {
        this.$uibModalInstance.dismiss('cancel');
    }
}

ModalDeleteController.$inject = ['$scope', '$window', '$state', '$q', 'WriteQueries', 'notification', 'params', 'view', 'entry', '$uibModalInstance'];
