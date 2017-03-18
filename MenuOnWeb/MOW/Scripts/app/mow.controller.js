(function () {
    var app = angular.module("mowApp", ['ui.router', 'angularUtils.directives.dirPagination']);

    app.controller("mowController", ['mowService', '$state', function (mowService, $state) {
        var vm = this;

        vm.dateNow = new Date();
        vm.recipes = [];

        vm.indexOfEditElement = null;

        activate();

        function activate() {
            var recipesPromise = mowService.getRecipes();
            recipesPromise.then(function (response) {
                console.log("[mowController] recipesPromise - ", response);
                vm.recipes.push.apply(vm.recipes, response.data);
            });
        };
    }]);

    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/Templates/HomePage.html',
                controllerAs: 'vm'
            })
    });

})();