'use strict';

angular.module('arethusaTranslateGuiApp').directive('container', [
  function() {
    return {
      restrict: 'A',
      link: function(scope) {
        scope.allClean = function(container) {
          var clean = true;
          for (var i = container.length - 1; i >= 0; i--){
            if (container[i].dirty) {
                clean = false;
                break;
            }
          }
          return clean;
        };

        scope.$watch('container.dirty', function(newVal) {
          scope.statusClass = newVal ? 'dirty-bg' : 'clean-bg';
        });

        scope.$on('mainChange', function() {
          scope.container.dirty = true;
          scope.$broadcast('mainDirty');
        });

        scope.$on('clean', function() {
          var cont = scope.container;
          if (scope.allClean(cont.containers) && scope.allClean(cont.values)) {
           scope.container.dirty = false;
          }
        });
      },
      templateUrl: 'app/i18n/container.directive.html'
    };
  }
]);
