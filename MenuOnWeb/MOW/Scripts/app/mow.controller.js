(function () {
    var app = angular.module("mowApp", ['ui.router', 'angularUtils.directives.dirPagination']);

    app.controller("mowController", ['mowService', '$state', function (mowService, $state) {
        var vm = this;

        vm.dateNow = new Date();
        vm.recipes = [];
        vm.comments = [];
        vm.currentUser = null;

        vm.login = null;
        vm.password = null;
        vm.confirmPassword = null;

        vm.indexOfEditElement = null;
        vm.isAuthorized = false;
        vm.role = null;
        vm.recipeToShow = null;
        vm.Ingridients = null;
        vm.recipeToAdd = { Name: null, Text: null, ImageUrl: null };

        activate();

        function activate() {
            mowService.getRecipes()
                .then((response) => {
                    vm.recipes.push.apply(vm.recipes, response.data);
                }, (error) => {
                    console.log("[mowController] getRecipes failed - ", error);
                });
        };

        vm.onAddNewRecipe = () => {
            console.log(vm.Ingridients);
            var tags = vm.Ingridients.split(',');
            var newRecipe = {
                Id: 0,
                UserId: vm.currentUser.Id,
                Name: vm.recipeToAdd.Name,
                Text: vm.recipeToAdd.Text,
                ImageUrl: vm.recipeToAdd.ImageUrl,
                Tags: tags
            };

            mowService
                .addRecipe(newRecipe)
                    .then((response) => {
                        vm.recipes.unshift(response.data);
                        vm.recipeToAdd.Name = null;
                        vm.recipeToAdd.Text = null;
                        vm.recipeToAdd.ImageUrl = null;
                        vm.Ingridients = null;
                        $state.go('home');
                    }, (error) => {
                        console.log(`[mowController] onAddNewRecipe - fail. Details: ${error}`, arguments);
                        alert("Adding a new recipe has failed.");
                    });
        };

        vm.removeRecipe = (recipe) => {
            mowService
                .removeRecipe(recipe)
                .then((response) => {
                    for (var i = 0; i < vm.recipes.length; i++) {
                        if (recipe.Id == vm.recipes[i].Id) {
                            vm.recipes.splice(i, 1);
                        }
                    }
                    $state.go('home');
                }, (error) => {
                    console.log(`[LinkController] remove - fail. Details: ${error}`);
                    alert("Removing a recipe has failed.");
                });
        };

        vm.showEditForm = (indx) => {
            var recipeToEdit = vm.recipes.some((val, i) => i === indx);
            vm.editRecipe = recipeToEdit;
            $state.go('edit');
        };

        vm.saveEditing = () => {
            mowService
                .updateRecipe(vm.editRecipe)
                .then((response) => {
                    vm.indexOfEditElement = null;
                    $state.go('home');
                }, (error) => {
                    console.log(`[mowController]  update - error. Details: ${error}`);
                    alert("Updating link has failed");
                })
        };

        vm.showRecipe = (recipe) => {
            recipe.comments = [];
            mowService
               .getRecipeComments(recipe)
               .then((response) => {
                   recipe.comments.push.apply(recipe.comments, response.data);
                   vm.recipeToShow = recipe;
                   $state.go('showRecipe');
               }, (error) => {
                   console.log("[mowController] getRecipeComments failed - ", error);
               });
        };

        vm.singIn = () => {
            mowService
                .findUser(vm.login, vm.password)
                .then((response) => {
                    if (response.data == null) {
                        alert('invalid parameters');
                        return;
                    }
                    vm.currentUser = Object.assign({}, response.data);
                    document.elementFromPoint(10, 10).click();
                    vm.isAuthorized = true;
                }, (error) => {
                    console.log("failed - ", error);
                })
        };

        vm.singUp = () => {
            mowService
                .addUser({ Login: vm.login, Password: vm.password })
                .then((response) => {
                    vm.currentUser = response.data;
                    document.elementFromPoint(10, 10).click();
                    vm.isAuthorized = true;
                }, (error) => {
                    console.log("failed - ", error);
                });
        };

        vm.logOut = () => {
            vm.currentUser = null;
            vm.isAuthorized = false;
            vm.role = null;
        };

        vm.toHomePage = () => {
            $state.go('home');
        };

        vm.toAddForm = () => {
            $state.go('add');
        };

        vm.addLike = (id) => {
            if (!vm.isAuthorized) {
                alert('unauthorized user cant like!!!');
                return;
            }
            mowService
                .addLike({ UserId: vm.currentUser.Id, RecipeId: id })
                .then((response) => {
                    vm.recipes.forEach((i) => {
                        if (i.Id == response.data.RecipeId) {
                            response.data.Value == 0 ? i.Likes-- : i.Likes++;
                            return;
                        }
                    })
                }, (error) => {
                    console.log('failed - ', error);
                });
        };
    }]);

    app.config(($stateProvider, $urlRouterProvider) => {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/Templates/HomePage.html',
                controllerAs: 'vm'
            })
            .state('add', {
                url: '/addRecipe',
                templateUrl: '/Templates/AddRecipe.html',
                controllerAs: 'vm'
            })
            .state('edit', {
                url: '/editRecipe',
                templateUrl: '/Templates/EditeRecipe.html',
                controllerAs: 'vm'
            })
            .state('singIn', {
                url: '/singIn',
                templateUrl: '/Templates/SingInForm.html',
                constrollerAs: 'vm'
            })
            .state('singUp', {
                url: '/singUp',
                templateUrl: '/Templates/SingUpForm.html',
                constrollerAs: 'vm'
            })
            .state('showRecipe', {
                url: '/showRecipe',
                templateUrl: '/Templates/ShowRecipe.html',
                constrollerAs: 'vm'
            })
            .state('default', {
                url: '/home',
                templateUrl: '/Templates/HomePage.html',
                controllerAs: 'vm'
            });
    });

})();