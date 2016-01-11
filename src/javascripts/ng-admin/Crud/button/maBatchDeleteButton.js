export default function maBatchDeleteButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            selection: '&',
            label: '@',
            usePopup: '=',
        },
        link: function ($scope) {
            $scope.label = $scope.label || 'Delete';

            $scope.gotoBatchDelete = function () {
                var ids = $scope.selection().map(function(entry) {
                    return entry.identifierValue;
                });

                var stateName = $scope.usePopup ? 'batchDeletePopup':'batchDelete';
                $state.go(stateName, angular.extend({
                    ids: ids,
                    entity: $scope.entity().name()
                }, $state.params));
            };
        },
        template:
`<span ng-click="gotoBatchDelete()">
<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</span>`
    };
}

maBatchDeleteButtonDirective.$inject = ['$state'];
