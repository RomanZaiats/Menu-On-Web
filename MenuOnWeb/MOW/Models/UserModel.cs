using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MOW.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string AvatarUrl { get; set; }
        public string Role { get; set; }
        public List<ViewRecipe> MyRecipes { get; set; }
        public List<ViewRecipe> FavouriteRecipes { get; set; }

        public static explicit operator UserModel(User userEntity)
        {
            var myRecipesView = new List<ViewRecipe>();
            foreach (var item in userEntity.Recipes)
            {
                myRecipesView.Add((ViewRecipe)item);
            }
            var myFavRecipesView = new List<ViewRecipe>();
            foreach (var item in userEntity.FavouriteRecipes)
            {
                myFavRecipesView.Add((ViewRecipe)item);
            }

            var user = new UserModel()
            {
                Id = userEntity.Id,
                Login = userEntity.Login,
                Password = userEntity.Password,
                AvatarUrl = userEntity.AvatarUrl,
                Role = userEntity.Role,
                MyRecipes = myRecipesView,
                FavouriteRecipes = myFavRecipesView
            };

            return user;
        }
    }
}