((angular) => {
    angular
        .module('mowApp')
        .factory('mowService', mowService);

    mowService.$inject = ['$http'];

    function mowService($http) {
        return {
            getRecipes: () =>  $http.get("/Home/GetRecipes"),
            getRecipeComments: (recipe) => $http.post("/Home/GetRecipeComments", recipe),
            addRecipe: (recipe) =>  $http.post("/Home/AddRecipe", recipe),
            updateRecipe: (recipe) => $http.post("/Home/UpdateRecipe", recipe),
            removeRecipe: (recipe) => $http.post("/Home/RemoveRecipe", recipe),
            addUser: (user) => $http.post("/Home/AddUser", user),
            removeUser: (user) => $http.post("/Home/RemoveUser", user),
            findUser: (login, password) => $http.post("/Home/FindUser", { Login: login, Password: password }),
            addComment: (comment) => $http.post("/Home/AddComment", comment),
            removeComment: (comment) => $http.post("/Home/RemoveComment", comment),
            updateComment: (comment) => $http.post("/Home/UpdateComment", comment),
            addLike: (like) => $http.post("/Home/Like", like),
            removeLike: (like) => $http.post("/Home/RemoveLike", like),
            updateLike: (like) => $http.post("/Home/UpdateLike", like),
            addFavourites: (fav) => $http.post("/Home/AddFavourites", fav),
            removeFavourites: (fav) => $http.post("/Home/RemoveFavourites", fav)
        };
    }
})(angular);