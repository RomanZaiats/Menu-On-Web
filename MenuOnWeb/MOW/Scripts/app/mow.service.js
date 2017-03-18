(function (angular) {
    angular
        .module('mowApp')
        .factory('mowService', mowService);

    mowService.$inject = ['$http'];

    function mowService($http) {
        var service = {
            getRecipes: getRecipes
        };
        function getRecipes() {
            var promise = $http.get("/Home/GetRecipes");
            return promise;
        };
        return service;
    }
})(angular);