using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        public string[] Tags { get; set; }

        public static explicit operator ViewRecipe(Recipe recipeEntity)
        {
            var likes = recipeEntity.Likes.Sum(i => i.Value);
            string[] tags = recipeEntity.Tags.Split(',');
            for(int i = 0; i < tags.Length; i++)
            {
                tags[i] = tags[i].Trim();
            }

            ViewRecipe recipe = new ViewRecipe()
            {
                Id = recipeEntity.Id,
                UserId = recipeEntity.UserId,
                Name = recipeEntity.Name,
                Text = recipeEntity.Text,
                ImageUrl = recipeEntity.ImageUrl,
                Likes = likes,
                Tags = tags
            };

            return recipe;
        }

        public static explicit operator Recipe(ViewRecipe recipe)
        {
            StringBuilder tags = new StringBuilder(recipe.Tags[0]);
            for(var i = 1; i < recipe.Tags.Length; i++)
            {
                tags.Append($", {recipe.Tags[i]}");
            }
            Recipe recipeEntity = new Recipe()
            {
                Id = recipe.Id,
                UserId = recipe.UserId,
                Name = recipe.Name,
                Text = recipe.Text,
                ImageUrl = recipe.ImageUrl,
                Tags = tags.ToString(),
                CreateDate = DateTime.Now
            };

            return recipeEntity;
        }
    }
}