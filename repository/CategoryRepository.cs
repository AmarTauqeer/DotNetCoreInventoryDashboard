using DotNetCoreInventoryDashboard.dtos.Category;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;
using Microsoft.EntityFrameworkCore;

namespace DotNetCoreInventoryDashboard.repository
{
    public class CategoryRepository(models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB) : ICategory
    {
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        public async Task<Category> CreateAsync(Category category)
        {
            await _db.Categories.AddAsync(category);
            await _db.SaveChangesAsync();
            return category;
        }

        public async Task<Category?> DeleteAsync(int id)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(x => x.CategoryId == id);
            if (category == null)
            {
                return null;
            }
            _db.Remove(category);
            await _db.SaveChangesAsync();
            return category;
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _db.Categories.Include(d => d.Products).ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _db.Categories.Include(d => d.Products).FirstOrDefaultAsync(i => i.CategoryId == id);
        }

        public async Task<Category?> UpdateAsync(int id, CreateUpdateCategoryDto createUpdateCategoryDto)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(x => x.CategoryId == id);
            if (category == null)
            {
                return null;
            }
            category.CategoryId = id;
            category.Name = createUpdateCategoryDto.Name;
            category.CreateAt = createUpdateCategoryDto.CreateAt;

            await _db.SaveChangesAsync();
            return category;
        }
    }
}
