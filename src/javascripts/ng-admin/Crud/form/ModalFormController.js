import FormController from './FormController';

export default class ModalFormController extends FormController {
    constructor($scope, $state, WriteQueries, Configuration, progression, notification, view, dataStore, $uibModalInstance) {
        super($scope, $state, WriteQueries, Configuration, progression, notification, view, dataStore);
        this.$uibModalInstance = $uibModalInstance;
    }

    submitCreation($event) {
        $event.preventDefault();
        if (!this.validateEntry()) {
            return;
        }
        var view = this.view;
        var restEntry = this.$scope.entry.transformToRest(view.fields());
        this.progression.start();
        this.WriteQueries
            .createOne(view, restEntry)
            .then(rawEntry => {
                var entry = view.mapEntry(rawEntry);
                this.$uibModalInstance.close(entry);
                this.progression.done();
                this.notification.log('Element successfully created.', { addnCls: 'humane-flatty-success' });
            }, this.handleError.bind(this));
    }

    submitEdition($event) {
        $event.preventDefault();
        if (!this.validateEntry()) {
            return;
        }
        var view = this.view;
        var restEntry = this.$scope.entry.transformToRest(view.fields());
        this.progression.start();
        this.WriteQueries
            .updateOne(view, restEntry, this.originEntityId)
            .then(() => {
                this.$uibModalInstance.close();
                this.progression.done();
                this.notification.log('Changes successfully saved.', { addnCls: 'humane-flatty-success' });
            }, this.handleError.bind(this));
    }
}

ModalFormController.$inject = ['$scope', '$state', 'WriteQueries', 'NgAdminConfiguration', 'progression', 'notification', 'view', 'dataStore', '$uibModalInstance'];
