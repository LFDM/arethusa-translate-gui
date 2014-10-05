'use strict';

angular.module('arethusaTranslateGuiApp').directive('container', [
  '$timeout',
  'containerHelper',
  function($timeout, containerHelper) {
    return {
      restrict: 'A',
      link: function(scope) {
        function checkStatus() {
          containerHelper.checkStatus(scope);
        }

        scope.title = 'Container';

        function update() {
          scope.container.$update(function() {
            console.log('Database updated!');
          });
        }

        containerHelper.nameWatch(scope);
        containerHelper.dirtyWatch(scope);

        function addToStats(ev, el) {
          var stats = scope.getStats(scope.container);
          scope.addStats(stats, el);
          scope.addStats(scope.stats.total, el);
        }

        scope.$on('valueChange', checkStatus);
        scope.$on('valueAdded', addToStats);
        scope.$on('subcontainerChange', checkStatus);

        var timer;
        scope.deferredUpdate = function() {
          if (timer) $timeout.cancel(timer);
          timer = $timeout(update, 1500);
        };

        scope.immediateUpdate = function() {
          if (timer) $timeout.cancel(timer);
          update();
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
