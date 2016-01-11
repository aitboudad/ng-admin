/**
 * Link to edit
 *
 * Usage:
 * <ma-edit-button entity="entity" entry="entry" size="xs"></ma-edit-button>
 */
export default function maEditButtonDirective($state) {
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
            scope.label = scope.label || 'Edit';
            scope.edit = function() {
                var stateName = scope.usePopup ? 'editPopup':'edit';

                $state.go(stateName, stateParams);
            };
        },
        template:
` <button class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="edit()">
<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</button>`
    };
}

maEditButtonDirective.$inject = ['$state'];
