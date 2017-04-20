using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using DAL;
using MOW.Models;
using System.Threading.Tasks;
using System.Data.Entity;

namespace MOW.Controllers
{
    public class HomeController : Controller
    {
        private readonly MenuOnWebContext db;

        public HomeController()
        {
            db = new MenuOnWebContext();
        }

        public ActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> GetRecipes()
        {
            var recipes = await db.Recipes.ToListAsync();
            List<ViewRecipe> list = new List<ViewRecipe>();
            await Task.Factory.StartNew(() =>
            {
                foreach (var item in recipes)
                {
                    list.Add((ViewRecipe)item);
                }
            });

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<ActionResult> GetRecipeComments(ViewRecipe recipe)
        {
            List<CommentModel> resultComments = new List<CommentModel>();
            var comments = await db.Comments.Where(i => i.RecipeId == recipe.Id).ToListAsync();
            await Task.Factory.StartNew(() =>
            {
                foreach (var item in comments)
                {
                    resultComments.Add((CommentModel)item);
                }
            });

            return Json(resultComments, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public async Task<ActionResult> AddRecipe(ViewRecipe recipe)
        {
            Recipe recipeEntity = (Recipe)recipe;
            var added = db.Recipes.Add(recipeEntity);
            await db.SaveChangesAsync();

            return Json((ViewRecipe)added);
        }

        [HttpPost]
        public async Task<ActionResult> UpdateRecipe(ViewRecipe recipe)
        {
            Recipe recipeEntity = (Recipe)recipe;
            db.Entry(recipeEntity).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return Json(recipe);
        }

        [HttpPost]
        public ActionResult RemoveRecipe(ViewRecipe recipe)
        {
            var recipeToDelete = db.Recipes.Find(recipe.Id);
            db.Recipes.Remove(recipeToDelete);
            db.SaveChanges();
            return new EmptyResult();
        }

        [HttpPost]
        public async Task<ActionResult> AddUser(VerifyUserModel user)
        {
            var userToAdd = new User() { Login = user.Login, Password = user.Password, Role = "user" };
            db.Users.Add(userToAdd);
            await db.SaveChangesAsync();

            return Json((UserModel)userToAdd);
        }

        [HttpPost]
        public async Task<ActionResult> RemoveUser(int id)
        {
            var userToDelete = await db.Users.FindAsync(id);
            db.Users.Remove(userToDelete);
            await db.SaveChangesAsync();
            return new EmptyResult();
        }

        [HttpPost]
        public ActionResult FindUser(VerifyUserModel userToFind)
        {
            var user = db.Users.FirstOrDefault(i => i.Login == userToFind.Login && i.Password == userToFind.Password);
            return user == null ? null : Json((UserModel)user);
        }

        [HttpPost]
        public async Task<ActionResult> AddComment(CommentModel comment)
        {
            Comment commentToAdd = (Comment)comment;
            db.Comments.Add(commentToAdd);
            await db.SaveChangesAsync();
            return Json(comment);
        }

        [HttpPost]
        public async Task<ActionResult> RemoveComment(int id)
        {
            var commentToDelete = await db.Comments.FindAsync(id);
            db.Comments.Remove(commentToDelete);
            await db.SaveChangesAsync();
            return new EmptyResult();
        }

        [HttpPost]
        public async Task<ActionResult> Like(LikeModel like)
        {
            var l = db.Likes.FirstOrDefault(i => i.UserId == like.UserId && i.RecipeId == like.RecipeId);
            if (l != null)
            {
                if (l.Value == 0)
                    l.Value = 1;
                else
                    l.Value = 0;

                var val = l.Value;

                db.Entry(l).State = EntityState.Modified;
                await db.SaveChangesAsync();

                var obj = new { UserId = like.UserId, RecipeId = like.RecipeId, Value = val };
                return Json(obj);
            }
            else
            {
                var likeToAdd = new Like()
                {
                    UserId = like.UserId,
                    RecipeId = like.RecipeId,
                    Value = 1
                };
                db.Likes.Add(likeToAdd);

                await db.SaveChangesAsync();

                return Json(new { UserId = like.UserId, RecipeId = like.RecipeId, Value = 1 });
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddToFavourites(UserModel currentUser, ViewRecipe recipe)
        {
            var user = await db.Users.FindAsync(currentUser.Id);
            user.FavouriteRecipes.Add((Recipe)recipe);
            currentUser.FavouriteRecipes.Add(recipe);
            await db.SaveChangesAsync();

            return new EmptyResult();
        }
    }
}