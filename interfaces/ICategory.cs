using DotNetCoreInventoryDashboard.dtos.Category;
using DotNetCoreInventoryDashboard.dtos.Department;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.interfaces
{
    public interface ICategory
    {
        Task<List<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task<Category> CreateAsync(Category category);
        Task<Category?> UpdateAsync(int id, CreateUpdateCategoryDto createUpdateCategoryDto);
        Task<Category?> DeleteAsync(int id);
    }
}
