using DotNetCoreInventoryDashboard.dtos.Category;
using DotNetCoreInventoryDashboard.dtos.Product;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;
using Microsoft.EntityFrameworkCore;

namespace DotNetCoreInventoryDashboard.repository
{
    public class ProductRepository(models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB) : IProduct
    {
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        public async Task<Product> CreateAsync(Product product)
        {
            await _db.Products.AddAsync(product);
            await _db.SaveChangesAsync();
            return product; ;
        }

        public async Task<Product?> DeleteAsync(int id)
        {
            var product = await _db.Products.FirstOrDefaultAsync(x => x.ProductId == id);
            if (product == null)
            {
                return null;
            }
            _db.Remove(product);
            await _db.SaveChangesAsync();
            return product;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _db.Products.ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _db.Products.FindAsync(id);
        }

        public async Task<Product?> UpdateAsync(int id, CreateUpdateProductDto createUpdateProductDto)
        {
            var product = await _db.Products.FirstOrDefaultAsync(x => x.ProductId == id);
            if (product == null)
            {
                return null;
            }
            product.ProductId = id;
            product.Name = createUpdateProductDto.Name;
            product.CreateAt = createUpdateProductDto.CreateAt;
            product.CategoryId=createUpdateProductDto.CategoryId;
            product.PurchaseRate = createUpdateProductDto.PurchaseRate;
            product.SaleRate = createUpdateProductDto.SaleRate;
            product.ImagePath = createUpdateProductDto.ImagePath;
            await _db.SaveChangesAsync();
            return product;
        }
    }
}
