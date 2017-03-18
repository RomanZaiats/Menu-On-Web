using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using DAL;
using MOW.Models;

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

        public JsonResult GetRecipes()
        {
            var recipes = db.Recipes.ToList();
            List<ViewRecipe> list = new List<ViewRecipe>();
            foreach (var item in recipes)
            {
                list.Add((ViewRecipe)item);
            } 
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}