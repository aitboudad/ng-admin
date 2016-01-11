/**
 * Link to show
 *
 * Usage:
 * <ma-show-button entity="entity" entry="entry" size="xs"></ma-show-button>
 */
export default function maShowButtonDirective($state) {
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
            scope.label = scope.label || 'Show';
            scope.show = function() {
                var stateName = scope.usePopup ? 'showPopup':'show';

                $state.go(stateName, stateParams);
            };
        },
        template:
` <button class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="show()">
<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</button>`
    };
}

maShowButtonDirective.$inject = ['$state'];
