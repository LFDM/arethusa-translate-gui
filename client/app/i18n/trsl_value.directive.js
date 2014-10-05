'use strict';

angular.module('arethusaTranslateGuiApp').directive('trslValue', [
  function() {
    var DIRTY = 'dirty-bg';
    var CLEAN = 'clean-bg';
    var TRSL_CHANGE = 'trslChange';
    var VALUE_CHANGE = 'valueChange';
    var VALUE_REMOVED = 'valueRemoved';

    return {
      restrict: 'A',
      link: function(scope) {
        function switchClassAndNotify(newVal, oldVal) {
          scope.statusClass = newVal ? DIRTY : CLEAN;
          if (newVal !== oldVal) scope.$emit(VALUE_CHANGE, newVal);
        }

        function isClean() {
          if (scope.value.name) {
            var container = scope.value.translations;
            var clean = true;
            for (var i = container.length - 1; i >= 0; i--){
              if (container[i].dirty) {
                clean = false;
                break;
              }
            }
            return clean;
          }
        }

        function checkDirtyness() {
          scope.value.dirty = !isClean();
        }

        function changeAllStatus(bool) {
          var trsls = scope.value.translations;
          for (var i = trsls.length - 1; i >= 0; i--){
            var trsl = trsls[i];
            trsl.dirty = bool;
          }
        }

        scope.$watch('value.dirty', switchClassAndNotify);

        scope.$watch('value.name', function(newVal, oldVal) {
          if (!oldVal) checkDirtyness();
          if (!newVal) scope.value.dirty = true;
        });

        scope.$on('mainChange', function() {
          scope.value.dirty = true;
          scope.$broadcast('mainDirty');
          scope.deferredUpdate();
        });

        scope.$on(TRSL_CHANGE, checkDirtyness);

        scope.setDirty = function() {
          changeAllStatus(true);
        };

        scope.setClean = function() {
          changeAllStatus(false);
        };

        scope.remove = function() {
          scope.removeHelper(scope.container.values, scope.value, function() {
            scope.$emit(VALUE_REMOVED, scope.value);
            scope.immediateUpdate();
          });
        };
      },
      templateUrl: 'app/i18n/trsl_value.directive.html'
    };
  }
]);


