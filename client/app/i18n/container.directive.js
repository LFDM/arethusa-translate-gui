'use strict';

angular.module('arethusaTranslateGuiApp').directive('container', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope) {
        scope.$watch('container.dirty', function(newVal) {
          scope.statusClass = newVal ? 'dirty-bg' : 'clean-bg';
        });

        function checkStatus() {
          var cont = scope.container;
          if (scope.allClean(cont, 'containers') && scope.allClean(cont, 'values')) {
            scope.container.dirty = false;
          } else {
            scope.container.dirty = true;
          }
          scope.deferredUpdate();
        }

        //scope.$on('trslChange', checkStatus);
        scope.$on('subcontainerRemoved', checkStatus);

        scope.addMainDirtyListener = function(childScope, property) {
          childScope.$on('mainDirty', function() {
            childScope[property].dirty = true;
          });
        };

        function update() {
          scope.container.$update(function() {
            console.log('Database updated!');
          });
        }

        var timer;
        scope.deferredUpdate = function() {
          if (timer) $timeout.cancel(timer);
          timer = $timeout(update, 1500);
        };

        scope.addSubContainer = scope.subContainerFactory(scope);
        scope.addValue = scope.valueFactory(scope);

        scope.remove = function() {
          scope.removeHelper(scope.containers, scope.container, function() {
            scope.container.$remove();
          });
        };
      },
      templateUrl: 'app/i18n/container.directive.html'
    };
  }
]);
