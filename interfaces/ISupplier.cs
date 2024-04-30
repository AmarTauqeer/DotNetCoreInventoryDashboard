using DotNetCoreInventoryDashboard.dtos.Supplier;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.interfaces
{
    public interface ISupplier
    {
        Task<List<Supplier>> GetAllAsync();
        Task<Supplier?> GetByIdAsync(int id);
        Task<Supplier> CreateAsync(Supplier supplier);
        Task<Supplier?> UpdateAsync(int id, CreateUpdateSupplierDto createUpdateSupplierDto);
        Task<Supplier?> DeleteAsync(int id);
    }
}
