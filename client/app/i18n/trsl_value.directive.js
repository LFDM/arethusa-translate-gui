'use strict';

angular.module('arethusaTranslateGuiApp').directive('trslValue', [
  function() {
    var DIRTY = 'dirty-bg';
    var CLEAN = 'clean-bg';
    var TRSL_CHANGE = 'trslChange';
    var VALUE_CHANGE = 'valueChange';

    return {
      restrict: 'A',
      link: function(scope) {
        function switchClassAndNotify(newVal, oldVal) {
          scope.statusClass = newVal ? DIRTY : CLEAN;
          if (newVal !== oldVal) scope.$emit(VALUE_CHANGE);
        }

        function isClean() {
          return scope.allClean(scope.value, 'translations');
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
          scope.$emit(TRSL_CHANGE);
        }

        function addMissingTranslations() {
          var langs = scope.languages;
          var trsls = scope.value.translations;
          if (langs.length !== trsls.length) {
            var missing = angular.copy(langs);
            for (var i = trsls.length - 1; i >= 0; i--){
              var idx = missing.indexOf(trsls[i].lang);
              missing.splice(idx, 1);
            }
            for (var id = missing.length - 1; id >= 0; id--){
              trsls.push(scope.newTranslation(missing[id]));
            }
            scope.deferredUpdate();
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
            scope.$emit(VALUE_CHANGE);
            scope.immediateUpdate();
          });
        };

        addMissingTranslations();
      },
      templateUrl: 'app/i18n/trsl_value.directive.html'
    };
  }
]);


