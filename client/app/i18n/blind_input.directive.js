'use strict';

angular.module('arethusaTranslateGuiApp').directive('blindInput', [
  '$parse',
  function($parse) {
    return {
      restrict: 'AE',
      scope: {
        model: '&ngModel'
      },
      link: function(scope, element, attrs) {
        var parent = scope.$parent,
            getter = $parse(attrs.ngModel),
            setter = getter.assign;

        scope.$watch('model', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            setter(parent, scope.model);
            parent.deferredUpdate();
          }
        });
      },
      templateUrl: 'app/i18n/blind_input.directive.html'
    };
  }
]);