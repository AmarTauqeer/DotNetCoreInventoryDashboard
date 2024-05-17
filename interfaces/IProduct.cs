using DotNetCoreInventoryDashboard.dtos.Product;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.interfaces
{
    public interface IProduct
    {
        Task<List<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task<Product?> UpdateAsync(int id, CreateUpdateProductDto createUpdateProductDto);
        Task<Product?> DeleteAsync(int id);
        byte[] CreateReportFile(string pathRdlc);
    }
}
