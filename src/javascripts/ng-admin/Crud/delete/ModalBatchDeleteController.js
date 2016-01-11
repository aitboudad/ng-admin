import BatchDeleteController from './BatchDeleteController';

export default class ModalBatchDeleteController extends BatchDeleteController {
    constructor($scope, $state, WriteQueries, notification, view, $uibModalInstance) {
        super($scope, $state, WriteQueries, notification, view);
        this.$uibModalInstance = $uibModalInstance;
    }

    batchDelete() {
        var notification = this.notification;

        this.WriteQueries.batchDelete(this.view, this.entityIds).then(function () {
            this.$uibModalInstance.close();
            notification.log('Elements successfully deleted.', { addnCls: 'humane-flatty-success' });
        }, function (response) {
            // @TODO: share this method when splitting controllers
            var body = response.data;
            if (typeof body === 'object') {
                body = JSON.stringify(body);
            }

            notification.log('Oops, an error occured : (code: ' + response.status + ') ' + body, {addnCls: 'humane-flatty-error'});
        });
    }

    back() {
        this.$uibModalInstance.dismiss('cancel');
    }
}

ModalBatchDeleteController.$inject = ['$scope', '$state', 'WriteQueries', 'notification', 'view', '$uibModalInstance'];
