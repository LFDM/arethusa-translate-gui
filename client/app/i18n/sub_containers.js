'use strict';

angular.module('arethusaTranslateGuiApp').directive('subContainers', [
  '$compile',
  function($compile) {
   return {
     restrict: 'A',
     link: function(scope, element) {
       var template = '\
         <div\
           class="nested-container"\
           ng-repeat="container in container.containers track by container.createdAt">\
             <div sub-container/>\
         </div>\
       ';
       element.append($compile(template)(scope));
     }
   };
  }
]);
