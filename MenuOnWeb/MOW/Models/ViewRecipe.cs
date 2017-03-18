using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MOW.Models
{
    public class ViewRecipe
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public string ImageUrl { get; set; }
        public int Likes { get; set; }

        public static explicit operator ViewRecipe(Recipe recipeEntity)
        {
            var likes = recipeEntity.Likes.Sum(i => i.Value);
            ViewRecipe recipe = new ViewRecipe()
            {
                Id = recipeEntity.Id,
                UserId = recipeEntity.UserId,
                Name = recipeEntity.Name,
                Text = recipeEntity.Text,
                ImageUrl = recipeEntity.ImageUrl,
                Likes = likes
            };

            return recipe;
        }
    }
}