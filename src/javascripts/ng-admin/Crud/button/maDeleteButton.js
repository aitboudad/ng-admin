/**
 * Link to delete
 *
 * Usage:
 * <ma-delete-button entity="entity" entry="entry" size="xs"></ma-delete-button>
 */
export default function maDeleteButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            entityName: '@',
            entry: '&',
            size: '@',
            label: '@',
            usePopup: '=',
        },
        link: function (scope, element, attrs) {
            var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
            var stateParams = entityName == $state.params.entity ? { ...$state.params } : {};
            stateParams.entity = entityName;
            stateParams.id = scope.entry().identifierValue;

            scope.label = scope.label || 'Delete';
            scope.delete = function() {
                var stateName = scope.usePopup ? 'deletePopup':'delete';

                $state.go(stateName, stateParams);
            };
        },
        template:
` <button class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="delete()">
<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</button>`
    };
}

maDeleteButtonDirective.$inject = ['$state'];
