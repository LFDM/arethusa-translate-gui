'use strict';

angular.module('arethusaTranslateGuiApp').directive('trsl', [
  '$timeout',
  function($timeout) {
    var MAIN_LANGUAGE = 'en';
    var DIRTY = 'dirty-bg-dark';
    var CLEAN = 'clean-bg-dark';

    function getEventName(main) {
      return main ? 'mainChange' : 'trslChange';
    }

    function isMain(lang) {
      return MAIN_LANGUAGE === lang;
    }

    return {
      restrict: 'A',
      link: function(scope) {
        var main = isMain(scope.trsl.lang);
        var eventName = getEventName(main);

        function switchClasses(newVal) {
          scope.statusClass = newVal ? DIRTY : CLEAN;
          scope.toggleIcon = newVal ? 'check' : 'remove';
        }

        function changeStatus(bool) {
          var old = scope.trsl.dirty;
          if (main || old !== bool) {
            scope.trsl.dirty = bool;
            scope.$emit(eventName, scope.trsl);
          }
        }

        function setClean() {
          changeStatus(false);
        }

        function setDirty() {
          changeStatus(true);
        }

        scope.toggleStatus = function() {
          if (scope.trsl.dirty) {
            setClean();
          } else {
            setDirty();
          }
        };

        var timer;
        scope.trackChange = function() {
          if (timer) $timeout.cancel(timer);
          timer = $timeout(setClean, 1000);
        };

        if (main) {
          if (scope.trsl.dirty) {
            scope.trsl.dirty = false;
            scope.$emit('trslChange', scope.trsl);
          }
          scope.statusClass = '';
        } else {
          scope.$watch('trsl.dirty', switchClasses);
          scope.$on('mainDirty', setDirty);
        }
      },
      templateUrl: 'app/i18n/trsl.directive.html'
    };
  }
]);



